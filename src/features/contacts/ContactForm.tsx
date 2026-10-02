import { useState, type FormEvent } from 'react';
import { Field } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { useI18n } from '../../i18n';
import {
  CONTACT_ROLES,
  type Contact,
  type ContactInput,
  type ContactKind,
  type ContactRole,
} from '../../data/contacts';

interface ContactFormProps {
  contact: Contact | null;
  defaultRole?: ContactRole;
  busy: boolean;
  onClose: () => void;
  onSubmit: (input: ContactInput) => void;
}

interface FormState {
  kind: ContactKind;
  roles: ContactRole[];
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  vat: string;
  taxOffice: string;
  specialty: string;
  company: string;
  tags: string;
  notes: string;
  pinned: boolean;
}

function buildInitialState(
  contact: Contact | null,
  defaultRole?: ContactRole,
): FormState {
  return {
    kind: contact?.kind ?? 'person',
    roles: contact?.roles ?? (defaultRole ? [defaultRole] : []),
    firstName: contact?.firstName ?? '',
    lastName: contact?.lastName ?? '',
    companyName:
      contact && contact.kind === 'company' ? contact.name : '',
    phone: contact?.phone ?? '',
    mobile: contact?.mobile ?? '',
    email: contact?.email ?? '',
    website: contact?.website ?? '',
    street: contact?.address?.street ?? '',
    city: contact?.address?.city ?? '',
    postalCode: contact?.address?.postalCode ?? '',
    country: contact?.address?.country ?? '',
    vat: contact?.vat ?? '',
    taxOffice: contact?.taxOffice ?? '',
    specialty: contact?.specialty ?? '',
    company: contact?.company ?? '',
    tags: contact?.tags?.join(', ') ?? '',
    notes: contact?.notes ?? '',
    pinned: contact?.pinned ?? false,
  };
}

function clean(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function ContactForm({
  contact,
  defaultRole,
  busy,
  onClose,
  onSubmit,
}: ContactFormProps) {
  const t = useI18n();
  const [state, setState] = useState<FormState>(() =>
    buildInitialState(contact, defaultRole),
  );
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const toggleRole = (role: ContactRole) => {
    setState((s) => ({
      ...s,
      roles: s.roles.includes(role)
        ? s.roles.filter((r) => r !== role)
        : [...s.roles, role],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name =
      state.kind === 'company'
        ? state.companyName.trim()
        : `${state.firstName} ${state.lastName}`.trim();

    if (!name) {
      setError(t.contacts.nameRequired);
      return;
    }

    const address = {
      street: clean(state.street),
      city: clean(state.city),
      postalCode: clean(state.postalCode),
      country: clean(state.country),
    };
    const hasAddress = Object.values(address).some(Boolean);

    onSubmit({
      kind: state.kind,
      roles: state.roles,
      name,
      firstName:
        state.kind === 'person' ? clean(state.firstName) : undefined,
      lastName: state.kind === 'person' ? clean(state.lastName) : undefined,
      phone: clean(state.phone),
      mobile: clean(state.mobile),
      email: clean(state.email),
      website: clean(state.website),
      address: hasAddress ? address : undefined,
      vat: clean(state.vat),
      taxOffice: clean(state.taxOffice),
      specialty: clean(state.specialty),
      company: clean(state.company),
      tags: state.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: clean(state.notes),
      pinned: state.pinned,
    });
  };

  return (
    <Modal
      open
      size="lg"
      title={contact ? t.contacts.editContact : t.contacts.addContact}
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
            form="contact-form"
            className="btn btn-primary"
            disabled={busy}
          >
            {busy ? t.common.loading : t.common.save}
          </button>
        </>
      }
    >
      <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
        {error ? <div className="form-error">{error}</div> : null}

        <section className="form-section">
          <h3 className="form-section-title">{t.contacts.section.basics}</h3>

          <div className="field">
            <label>{t.contacts.field.kind}</label>
            <div className="segmented" role="group" aria-label={t.contacts.field.kind}>
              {(['person', 'company'] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  className={state.kind === kind ? 'active' : ''}
                  aria-pressed={state.kind === kind}
                  onClick={() => set('kind', kind)}
                >
                  {t.contacts.kind[kind]}
                </button>
              ))}
            </div>
          </div>

          <div className="form-grid">
            {state.kind === 'person' ? (
              <>
                <Field label={t.contacts.field.firstName} htmlFor="cf-first">
                  <input
                    id="cf-first"
                    className="input"
                    value={state.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                  />
                </Field>
                <Field label={t.contacts.field.lastName} htmlFor="cf-last">
                  <input
                    id="cf-last"
                    className="input"
                    value={state.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                  />
                </Field>
              </>
            ) : (
              <Field label={t.contacts.field.companyName} htmlFor="cf-company-name">
                <input
                  id="cf-company-name"
                  className="input"
                  value={state.companyName}
                  onChange={(e) => set('companyName', e.target.value)}
                />
              </Field>
            )}
          </div>

          <div className="field">
            <label>{t.contacts.field.roles}</label>
            <div className="chip-group">
              {CONTACT_ROLES.map((role) => {
                const active = state.roles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    className={`chip-toggle ${active ? 'active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggleRole(role)}
                  >
                    {t.contacts.role[role]}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="form-section">
          <h3 className="form-section-title">{t.contacts.section.contact}</h3>
          <div className="form-grid">
            <Field label={t.contacts.field.phone} htmlFor="cf-phone">
              <input
                id="cf-phone"
                className="input"
                value={state.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </Field>
            <Field label={t.contacts.field.mobile} htmlFor="cf-mobile">
              <input
                id="cf-mobile"
                className="input"
                value={state.mobile}
                onChange={(e) => set('mobile', e.target.value)}
              />
            </Field>
            <Field label={t.contacts.field.email} htmlFor="cf-email">
              <input
                id="cf-email"
                className="input"
                type="email"
                value={state.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </Field>
            <Field label={t.contacts.field.website} htmlFor="cf-website">
              <input
                id="cf-website"
                className="input"
                value={state.website}
                onChange={(e) => set('website', e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="form-section">
          <h3 className="form-section-title">{t.contacts.section.address}</h3>
          <div className="form-grid">
            <Field label={t.contacts.field.street} htmlFor="cf-street">
              <input
                id="cf-street"
                className="input"
                value={state.street}
                onChange={(e) => set('street', e.target.value)}
              />
            </Field>
            <Field label={t.contacts.field.city} htmlFor="cf-city">
              <input
                id="cf-city"
                className="input"
                value={state.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </Field>
            <Field label={t.contacts.field.postalCode} htmlFor="cf-postal">
              <input
                id="cf-postal"
                className="input"
                value={state.postalCode}
                onChange={(e) => set('postalCode', e.target.value)}
              />
            </Field>
            <Field label={t.contacts.field.country} htmlFor="cf-country">
              <input
                id="cf-country"
                className="input"
                value={state.country}
                onChange={(e) => set('country', e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="form-section">
          <h3 className="form-section-title">{t.contacts.section.details}</h3>
          <div className="form-grid">
            <Field label={t.contacts.field.vat} htmlFor="cf-vat">
              <input
                id="cf-vat"
                className="input"
                value={state.vat}
                onChange={(e) => set('vat', e.target.value)}
              />
            </Field>
            <Field label={t.contacts.field.taxOffice} htmlFor="cf-tax-office">
              <input
                id="cf-tax-office"
                className="input"
                value={state.taxOffice}
                onChange={(e) => set('taxOffice', e.target.value)}
              />
            </Field>
            <Field label={t.contacts.field.company} htmlFor="cf-company">
              <input
                id="cf-company"
                className="input"
                value={state.company}
                onChange={(e) => set('company', e.target.value)}
              />
            </Field>
            <Field label={t.contacts.field.specialty} htmlFor="cf-specialty">
              <input
                id="cf-specialty"
                className="input"
                value={state.specialty}
                onChange={(e) => set('specialty', e.target.value)}
              />
            </Field>
          </div>
          <Field
            label={t.contacts.field.tags}
            htmlFor="cf-tags"
            hint={t.contacts.field.tagsHint}
          >
            <input
              id="cf-tags"
              className="input"
              value={state.tags}
              onChange={(e) => set('tags', e.target.value)}
            />
          </Field>
        </section>

        <section className="form-section">
          <h3 className="form-section-title">{t.contacts.section.notes}</h3>
          <Field label={t.contacts.field.notes} htmlFor="cf-notes">
            <textarea
              id="cf-notes"
              className="textarea"
              value={state.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </Field>
          <label className="switch-row">
            <input
              type="checkbox"
              checked={state.pinned}
              onChange={(e) => set('pinned', e.target.checked)}
            />
            {t.contacts.field.pinned}
          </label>
        </section>
      </form>
    </Modal>
  );
}
