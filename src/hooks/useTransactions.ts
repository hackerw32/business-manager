import { useEffect, useState } from 'react';
import {
  subscribeTransactions,
  type Transaction,
} from '../data/transactions';

interface UseTransactionsResult {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

export function useTransactions(): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      subscribeTransactions(
        (items) => {
          setTransactions(items);
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

  return { transactions, loading, error };
}
