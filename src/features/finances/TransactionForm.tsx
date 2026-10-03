import { useState, type FormEvent } from 'react';
import { Field } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { useI18n } from '../../i18n';
import { todayIso } from '../../lib/format';
import type { Contact } from '../../data/contacts';
import {
  PAYMENT_METHODS,
  type PaymentMethod,
  type Transaction,
  type TransactionDirection,
  type TransactionInput,
  type TransactionStatus,
} from '../../data/transactions';
import { PRESET_CATEGORIES, isPresetCategory } from './categories';
import {
  ContactPicker,
  type ContactPickerValue,
} from '../contacts/ContactPicker';

interface TransactionFormProps {
  transaction: Transaction | null;
  contacts: Contact[];
  busy: boolean;
  onClose: () => void;
  onSubmit: (input: TransactionInput) => void;
}

interface FormState {
  direction: TransactionDirection;
  amount: string;
  date: string;
  status: TransactionStatus;
  contactId?: string;
  contactName: string;
  reference: string;
  method: PaymentMethod;
  receiptIssued: boolean;
  receiptDate: string;
  assignedContactId?: string;
  assignedName: string;
  notes: string;
  tags: string;
}

function buildInitialState(transaction: Transaction | null): FormState {
  return {
    direction: transaction?.direction ?? 'income',
    amount: transaction ? String(transaction.amount) : '',
    date: transaction?.date ?? todayIso(),
    status: transaction?.status ?? 'paid',
    contactId: transaction?.contactId,
    contactName: transaction?.contactName ?? '',
    reference: transaction?.reference ?? '',
    method: transaction?.method ?? 'cash',
    receiptIssued: transaction?.receiptIssued ?? false,
    receiptDate: transaction?.receiptDate ?? '',
    assignedContactId: transaction?.assignedContactId,
    assignedName: transaction?.assignedName ?? '',
    notes: transaction?.notes ?? '',
    tags: transaction?.tags?.join(', ') ?? '',
  };
}

function clean(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function TransactionForm({
  transaction,
  contacts,
  busy,
  onClose,
  onSubmit,
}: TransactionFormProps) {
  const t = useI18n();
  const [state, setState] = useState<FormState>(() =>
    buildInitialState(transaction),
  );
  const initialCategory = transaction?.category ?? 'inspection';
  const [categoryChoice, setCategoryChoice] = useState<string>(() =>
    isPresetCategory(initialCategory) ? initialCategory : '__custom',
  );
  const [customCategory, setCustomCategory] = useState<string>(() =>
    isPresetCategory(initialCategory) ? '' : initialCategory,
  );
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(state.amount.replace(',', '.'));
    if (!state.amount.trim() || Number.isNaN(amount) || amount <= 0) {
      setError(t.finances.amountRequired);
      return;
    }

    onSubmit({
      direction: state.direction,
      amount,
      date: state.date || todayIso(),
      status: state.status,
      contactId: state.contactId,
      contactName: state.contactId ? undefined : clean(state.contactName),
      category:
        categoryChoice === '__custom'
          ? customCategory.trim() || 'other'
          : categoryChoice,
      reference: clean(state.reference),
      method: state.method,
      receiptIssued: state.receiptIssued,
      receiptDate: state.receiptIssued ? clean(state.receiptDate) : undefined,
      assignedContactId: state.assignedContactId,
      assignedName: state.assignedContactId
        ? undefined
        : clean(state.assignedName),
      notes: clean(state.notes),
      tags: state.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  const handleContact = (value: ContactPickerValue) => {
    setState((s) => ({
      ...s,
      contactId: value.contactId,
      contactName: value.contactName ?? '',
    }));
  };

  const handleAssigned = (value: ContactPickerValue) => {
    setState((s) => ({
      ...s,
      assignedContactId: value.contactId,
      assignedName: value.contactName ?? '',
    }));
  };

  return (
    <Modal
      open
      size="lg"
      title={transaction ? t.finances.edit : t.finances.add}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={busy}
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            form="transaction-form"
            className="btn btn-primary"
            disabled={busy}
          >
            {busy ? t.common.loading : t.common.save}
          </button>
        </>
      }
    >
      <form
        id="transaction-form"
        className="contact-form"
        onSubmit={handleSubmit}
      >
        {error ? <div className="form-error">{error}</div> : null}

        <section className="form-section">
          <h3 className="form-section-title">{t.finances.section.main}</h3>

          <div className="field">
            <label>{t.finances.field.direction}</label>
            <div className="segmented" role="group" aria-label={t.finances.field.direction}>
              {(['income', 'expense'] as const).map((direction) => (
                <button
                  key={direction}
                  type="button"
                  className={state.direction === direction ? 'active' : ''}
                  aria-pressed={state.direction === direction}
                  onClick={() => set('direction', direction)}
                >
                  {t.finances[direction]}
                </button>
              ))}
            </div>
          </div>

          <div className="form-grid">
            <Field label={t.finances.field.amount} htmlFor="tf-amount">
              <input
                id="tf-amount"
                className="input"
                type="number"
                step="0.01"
                inputMode="decimal"
                value={state.amount}
                onChange={(e) => set('amount', e.target.value)}
              />
            </Field>
            <Field label={t.finances.field.date} htmlFor="tf-date">
              <input
                id="tf-date"
                className="input"
                type="date"
                value={state.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </Field>
          </div>

          <div className="field">
            <label>{t.finances.field.status}</label>
            <div className="segmented" role="group" aria-label={t.finances.field.status}>
              {(['paid', 'pending'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  className={state.status === status ? 'active' : ''}
                  aria-pressed={state.status === status}
                  onClick={() => set('status', status)}
                >
                  {t.finances[status === 'paid' ? 'statusPaid' : 'statusPending']}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>{t.finances.field.contact}</label>
            <ContactPicker
              contacts={contacts}
              value={{ contactId: state.contactId, contactName: state.contactName }}
              onChange={handleContact}
              addLabel={t.finances.addClient}
              namePlaceholder={t.finances.field.contactName}
              freeTextLabel={t.finances.freeText}
              inputId="tf-contact-name"
            />
          </div>

          <div className="form-grid">
            <Field label={t.finances.field.category} htmlFor="tf-category">
              <select
                id="tf-category"
                className="select"
                value={categoryChoice}
                onChange={(e) => setCategoryChoice(e.target.value)}
              >
                {PRESET_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {t.finances.category[category]}
                  </option>
                ))}
                <option value="__custom">
                  {t.finances.customCategoryOption}
                </option>
              </select>
            </Field>
            <Field label={t.finances.field.reference} htmlFor="tf-reference">
              <input
                id="tf-reference"
                className="input"
                value={state.reference}
                onChange={(e) => set('reference', e.target.value)}
                placeholder={t.finances.field.referenceHint}
              />
            </Field>
          </div>

          {categoryChoice === '__custom' ? (
            <Field
              label={t.finances.field.customCategory}
              htmlFor="tf-custom-category"
            >
              <input
                id="tf-custom-category"
                className="input"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </Field>
          ) : null}
        </section>

        <section className="form-section">
          <h3 className="form-section-title">{t.finances.section.payment}</h3>
          <div className="form-grid">
            <Field label={t.finances.field.method} htmlFor="tf-method">
              <select
                id="tf-method"
                className="select"
                value={state.method}
                onChange={(e) => set('method', e.target.value as PaymentMethod)}
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {t.finances.method[method]}
                  </option>
                ))}
              </select>
            </Field>
            {state.receiptIssued ? (
              <Field label={t.finances.field.receiptDate} htmlFor="tf-receipt-date">
                <input
                  id="tf-receipt-date"
                  className="input"
                  type="date"
                  value={state.receiptDate}
                  onChange={(e) => set('receiptDate', e.target.value)}
                />
              </Field>
            ) : null}
          </div>
          <label className="switch-row">
            <input
              type="checkbox"
              checked={state.receiptIssued}
              onChange={(e) => set('receiptIssued', e.target.checked)}
            />
            {t.finances.field.receiptIssued}
          </label>
        </section>

        <section className="form-section">
          <h3 className="form-section-title">{t.finances.section.assignment}</h3>
          <div className="field">
            <label>{t.finances.field.assigned}</label>
            <ContactPicker
              contacts={contacts}
              value={{
                contactId: state.assignedContactId,
                contactName: state.assignedName,
              }}
              onChange={handleAssigned}
              addLabel={t.finances.addContact}
              namePlaceholder={t.finances.field.assignedName}
              freeTextLabel={t.finances.freeText}
              inputId="tf-assigned-name"
            />
          </div>
        </section>

        <section className="form-section">
          <h3 className="form-section-title">{t.finances.section.notes}</h3>
          <Field
            label={t.contacts.field.tags}
            htmlFor="tf-tags"
            hint={t.contacts.field.tagsHint}
          >
            <input
              id="tf-tags"
              className="input"
              value={state.tags}
              onChange={(e) => set('tags', e.target.value)}
            />
          </Field>
          <Field label={t.contacts.field.notes} htmlFor="tf-notes">
            <textarea
              id="tf-notes"
              className="textarea"
              value={state.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </Field>
        </section>
      </form>
    </Modal>
  );
}
