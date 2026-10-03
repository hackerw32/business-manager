import { useMemo, useState, type FormEvent } from 'react';
import {
  Check,
  CheckCircle2,
  Circle,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';
import { formatDate, todayIso } from '../../lib/format';
import { useContacts } from '../../hooks/useContacts';
import { useTodos } from '../../hooks/useTodos';
import {
  PRIORITY_WEIGHT,
  createTodo,
  removeTodo,
  setTodoDone,
  todoSearchText,
  updateTodo,
  type Todo,
  type TodoInput,
} from '../../data/todos';
import { TodoForm } from './TodoForm';

type StatusFilter = 'all' | 'open' | 'done';

const PRIORITY_BADGE = {
  high: 'badge-danger',
  normal: 'badge-accent',
  low: 'badge-neutral',
} as const;

export function TodosView() {
  const t = useI18n();
  const { notify } = useToast();
  const { todos, loading, error } = useTodos();
  const { contacts } = useContacts();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('open');
  const [quickTitle, setQuickTitle] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null);
  const [deleting, setDeleting] = useState<Todo | null>(null);
  const [busy, setBusy] = useState(false);

  const nameById = useMemo(
    () => new Map(contacts.map((c) => [c.id, c.name])),
    [contacts],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = todos
      .filter((todo) => statusFilter === 'all' || todo.status === statusFilter)
      .filter((todo) => !term || todoSearchText(todo).includes(term));
    return list.sort((a, b) => {
      if (a.status !== b.status) return a.status === 'open' ? -1 : 1;
      if (a.status === 'open') {
        const aDue = a.dueDate ?? '9999-12-31';
        const bDue = b.dueDate ?? '9999-12-31';
        if (aDue !== bDue) return aDue.localeCompare(bDue);
        return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      }
      return (b.completedAt ?? '').localeCompare(a.completedAt ?? '');
    });
  }, [todos, statusFilter, search]);

  const contactNameOf = (todo: Todo): string => {
    if (todo.contactId) {
      return nameById.get(todo.contactId) ?? todo.contactName ?? '';
    }
    return todo.contactName ?? '';
  };

  const handleQuickAdd = async (e: FormEvent) => {
    e.preventDefault();
    const title = quickTitle.trim();
    if (!title) return;
    setQuickTitle('');
    try {
      await createTodo({
        title,
        priority: 'normal',
        status: 'open',
        tags: [],
      });
      notify(t.todos.created);
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const toggle = async (todo: Todo) => {
    try {
      await setTodoDone(todo.id, todo.status !== 'done');
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (todo: Todo) => {
    setEditing(todo);
    setFormOpen(true);
  };

  const handleSubmit = async (input: TodoInput) => {
    setBusy(true);
    try {
      if (editing) {
        await updateTodo(editing.id, input);
        notify(t.todos.updated);
      } else {
        await createTodo(input);
        notify(t.todos.created);
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await removeTodo(deleting.id);
      notify(t.todos.deleted);
      setDeleting(null);
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const today = todayIso();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{t.apps.todos.title}</h1>
          <p className="page-subtitle">{t.apps.todos.description}</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} />
            {t.todos.add}
          </button>
        </div>
      </div>

      <form className="todo-add" onSubmit={handleQuickAdd}>
        <input
          className="input"
          value={quickTitle}
          placeholder={t.todos.quickPlaceholder}
          onChange={(e) => setQuickTitle(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={!quickTitle.trim()}>
          <Plus size={16} />
          {t.common.add}
        </button>
      </form>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            className="input"
            value={search}
            placeholder={t.todos.searchPlaceholder}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t.common.search}
          />
        </div>
        <div className="chip-group">
          {(['open', 'done', 'all'] as const).map((status) => (
            <button
              key={status}
              type="button"
              className={`chip ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'open' ? t.todos.open : status === 'done' ? t.todos.done : t.todos.all}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="page-loading">
          <Loader2 className="spin" size={26} />
        </div>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 size={30} />}
          title={search ? t.todos.noResults : t.apps.todos.title}
          message={search ? undefined : t.todos.emptyText}
        />
      ) : (
        <div className="todo-list">
          {filtered.map((todo) => {
            const done = todo.status === 'done';
            const overdue =
              !done && !!todo.dueDate && todo.dueDate < today;
            const who = contactNameOf(todo);
            return (
              <div
                className={`todo-row ${done ? 'is-done' : ''}`}
                key={todo.id}
              >
                <button
                  type="button"
                  className={`todo-check ${done ? 'checked' : ''}`}
                  onClick={() => toggle(todo)}
                  aria-label={done ? t.todos.markOpen : t.todos.markDone}
                >
                  {done ? <Check size={14} /> : <Circle size={14} />}
                </button>

                <div className="todo-main">
                  <div className="todo-title">{todo.title}</div>
                  <div className="todo-meta">
                    {todo.priority !== 'normal' ? (
                      <span className={`badge ${PRIORITY_BADGE[todo.priority]}`}>
                        {t.todos.priorities[todo.priority]}
                      </span>
                    ) : null}
                    {todo.dueDate ? (
                      <span className={`todo-due ${overdue ? 'overdue' : ''}`}>
                        {overdue ? `${t.todos.overdue}: ` : ''}
                        {formatDate(todo.dueDate)}
                      </span>
                    ) : null}
                    {who ? <span>· {who}</span> : null}
                    {todo.tags.map((tag) => (
                      <span key={tag} className="badge badge-neutral">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="contact-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={() => openEdit(todo)}
                    title={t.common.edit}
                    aria-label={t.common.edit}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon btn-icon-danger"
                    onClick={() => setDeleting(todo)}
                    title={t.common.delete}
                    aria-label={t.common.delete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen ? (
        <TodoForm
          todo={editing}
          contacts={contacts}
          busy={busy}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      ) : null}

      <ConfirmDialog
        open={!!deleting}
        danger
        busy={busy}
        title={t.todos.deleteTitle}
        message={t.todos.deleteMessage}
        confirmLabel={t.common.delete}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
