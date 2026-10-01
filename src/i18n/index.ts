import { useSettings } from '../context/SettingsContext';
import en, { type Translation } from './en';
import el from './el';

const dictionaries: Record<string, Translation> = { en, el };

export function useI18n(): Translation {
  const { language } = useSettings();
  return dictionaries[language] ?? en;
}

export type { Translation };
