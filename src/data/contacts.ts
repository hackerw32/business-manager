import {
  createOwned,
  removeOwned,
  subscribeOwned,
  updateOwned,
} from './firestore';

export type ContactKind = 'person' | 'company';
export type ContactRole = 'client' | 'partner' | 'supplier' | 'lead';

export interface ContactAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface Contact {
  id: string;
  ownerId: string;
  kind: ContactKind;
  roles: ContactRole[];
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  address?: ContactAddress;
  vat?: string;
  taxOffice?: string;
  specialty?: string;
  company?: string;
  tags: string[];
  notes?: string;
  pinned: boolean;
}

export type ContactInput = Omit<Contact, 'id' | 'ownerId'>;

const COLLECTION = 'contacts';

export const CONTACT_ROLES: ContactRole[] = [
  'client',
  'partner',
  'supplier',
  'lead',
];

export function subscribeContacts(
  onChange: (contacts: Contact[]) => void,
  onError?: (error: Error) => void,
) {
  return subscribeOwned<Contact>(COLLECTION, onChange, onError);
}

export function createContact(input: ContactInput): Promise<string> {
  return createOwned(COLLECTION, input);
}

export function updateContact(id: string, input: ContactInput): Promise<void> {
  return updateOwned(COLLECTION, id, input);
}

export function setContactPinned(id: string, pinned: boolean): Promise<void> {
  return updateOwned(COLLECTION, id, { pinned });
}

export function removeContact(id: string): Promise<void> {
  return removeOwned(COLLECTION, id);
}

export function contactInitial(contact: Contact): string {
  const source = contact.name || contact.company || '?';
  return source.trim().charAt(0).toUpperCase() || '?';
}

export function contactSearchText(contact: Contact): string {
  return [
    contact.name,
    contact.firstName,
    contact.lastName,
    contact.company,
    contact.email,
    contact.phone,
    contact.mobile,
    contact.vat,
    contact.specialty,
    ...contact.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
