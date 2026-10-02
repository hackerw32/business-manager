import { Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface DynamicListProps<T extends { id: string }> {
  items: T[];
  createItem: () => T;
  addLabel: string;
  removeLabel: string;
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    patch: (patch: Partial<T>) => void,
  ) => ReactNode;
}

export function DynamicList<T extends { id: string }>({
  items,
  createItem,
  addLabel,
  removeLabel,
  onChange,
  renderItem,
}: DynamicListProps<T>) {
  const add = () => onChange([...items, createItem()]);

  const update = (id: string, patch: Partial<T>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const remove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="dynamic-list">
      {items.map((item) => (
        <div className="dynamic-row" key={item.id}>
          <div className="dynamic-row-fields">
            {renderItem(item, (patch) => update(item.id, patch))}
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon btn-icon-danger"
            onClick={() => remove(item.id)}
            title={removeLabel}
            aria-label={removeLabel}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={add}>
        <Plus size={14} />
        {addLabel}
      </button>
    </div>
  );
}
