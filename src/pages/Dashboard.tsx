import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { APPS } from '../config/apps';
import { useI18n } from '../i18n';

export function Dashboard() {
  const t = useI18n();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{t.nav.dashboard}</h1>
          <p className="page-subtitle">{t.app.tagline}</p>
        </div>
      </div>

      <div className="app-grid">
        {APPS.map((app) => {
          const Icon = app.icon;
          return (
            <Link key={app.id} to={app.path} className="app-card">
              <span
                className="app-card-icon"
                style={{ backgroundColor: app.color }}
              >
                <Icon size={22} />
              </span>
              <h3>{t.apps[app.id].title}</h3>
              <p>{t.apps[app.id].description}</p>
              <span className="app-card-arrow">
                {t.common.open} <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
