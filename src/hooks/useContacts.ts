import { useEffect, useState } from 'react';
import { subscribeContacts, type Contact } from '../data/contacts';

interface UseContactsResult {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
}

export function useContacts(): UseContactsResult {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      subscribeContacts(
        (items) => {
          setContacts(items);
          setError(null);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        },
      ),
    [],
  );

  return { contacts, loading, error };
}
