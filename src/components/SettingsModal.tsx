import { useEffect } from 'react';
import { X } from 'lucide-react';
import {
  useSettings,
  type FontScale,
  type Language,
  type Theme,
} from '../context/SettingsContext';
import { useI18n } from '../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface SegmentProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  ariaLabel: string;
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: SegmentProps<T>) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={value === opt.value ? 'active' : ''}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsModal({ open, onClose }: Props) {
  const { theme, setTheme, language, setLanguage, fontScale, setFontScale } =
    useSettings();
  const t = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const themeOptions: { value: Theme; label: string }[] = [
    { value: 'light', label: t.settings.themeLight },
    { value: 'dark', label: t.settings.themeDark },
    { value: 'system', label: t.settings.themeSystem },
  ];

  const langOptions: { value: Language; label: string }[] = [
    { value: 'en', label: t.settings.languageEnglish },
    { value: 'el', label: t.settings.languageGreek },
  ];

  const fontOptions: { value: FontScale; label: string }[] = [
    { value: 'small', label: t.settings.fontSmall },
    { value: 'medium', label: t.settings.fontMedium },
    { value: 'large', label: t.settings.fontLarge },
  ];

  return (
    <div className="modal-scrim" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={t.settings.title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2>{t.settings.title}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label={t.common.close}
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="settings-group">
            <div className="setting-row">
              <div>
                <div className="setting-label">{t.settings.theme}</div>
              </div>
              <Segmented
                value={theme}
                options={themeOptions}
                onChange={setTheme}
                ariaLabel={t.settings.theme}
              />
            </div>

            <div className="setting-row">
              <div>
                <div className="setting-label">{t.settings.language}</div>
              </div>
              <Segmented
                value={language}
                options={langOptions}
                onChange={setLanguage}
                ariaLabel={t.settings.language}
              />
            </div>

            <div className="setting-row">
              <div>
                <div className="setting-label">{t.settings.font}</div>
              </div>
              <Segmented
                value={fontScale}
                options={fontOptions}
                onChange={setFontScale}
                ariaLabel={t.settings.font}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
