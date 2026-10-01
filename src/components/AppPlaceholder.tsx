import { getApp, type AppMeta } from '../config/apps';
import { useI18n } from '../i18n';

export function AppPlaceholder({ id }: { id: AppMeta['id'] }) {
  const t = useI18n();
  const app = getApp(id);
  if (!app) return null;
  const Icon = app.icon;

  return (
    <div className="placeholder-page">
      <div>
        <span className="ph-icon">
          <Icon size={32} />
        </span>
        <h2>{t.common.comingSoon}</h2>
        <p>{t.common.comingSoonText}</p>
      </div>
    </div>
  );
}
