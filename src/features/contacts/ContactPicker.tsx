import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Contact } from '../../data/contacts';
import { QuickContactDialog } from './QuickContactDialog';

export interface ContactPickerValue {
  contactId?: string;
  contactName?: string;
}

interface ContactPickerProps {
  contacts: Contact[];
  value: ContactPickerValue;
  onChange: (value: ContactPickerValue) => void;
  addLabel: string;
  namePlaceholder: string;
  freeTextLabel: string;
  inputId?: string;
}

// Select an existing contact, add a new one inline, or type a one-off name.
export function ContactPicker({
  contacts,
  value,
  onChange,
  addLabel,
  namePlaceholder,
  freeTextLabel,
  inputId,
}: ContactPickerProps) {
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <div className="contact-picker">
      <div className="contact-picker-row">
        <select
          className="select"
          value={value.contactId ?? ''}
          onChange={(e) => {
            const id = e.target.value;
            if (!id) {
              onChange({ contactId: undefined, contactName: value.contactName });
              return;
            }
            const contact = contacts.find((c) => c.id === id);
            onChange({ contactId: id, contactName: contact?.name });
          }}
        >
          <option value="">{freeTextLabel}</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
              {contact.specialty ? ` — ${contact.specialty}` : ''}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => setQuickOpen(true)}
        >
          <Plus size={14} />
          {addLabel}
        </button>
      </div>

      {value.contactId ? null : (
        <input
          id={inputId}
          className="input"
          placeholder={namePlaceholder}
          value={value.contactName ?? ''}
          onChange={(e) =>
            onChange({ contactId: undefined, contactName: e.target.value })
          }
        />
      )}

      <QuickContactDialog
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        onCreated={(contact) => {
          onChange({ contactId: contact.id, contactName: contact.name });
          setQuickOpen(false);
        }}
      />
    </div>
  );
}
