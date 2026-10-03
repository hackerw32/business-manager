import { useEffect, useState } from 'react';
import { subscribeTodos, type Todo } from '../data/todos';

interface UseTodosResult {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export function useTodos(): UseTodosResult {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      subscribeTodos(
        (items) => {
          setTodos(items);
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

  return { todos, loading, error };
}
