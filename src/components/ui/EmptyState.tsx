import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon ? <span className="empty-icon">{icon}</span> : null}
      <h3>{title}</h3>
      {message ? <p className="muted">{message}</p> : null}
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  );
}
