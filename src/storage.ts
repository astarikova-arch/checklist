import type { FormValues } from './types';

const STORAGE_KEY = 'automation-checklist-v1';

function migrateFormValues(values: FormValues): FormValues {
  const next: FormValues = { ...values };

  for (const key of Object.keys(values)) {
    const match = key.match(/^logic_(faq|topics)_(.+)$/);
    if (!match) continue;
    const newKey = `module_${match[1]}_${match[2]}`;
    if (next[newKey] === undefined) {
      next[newKey] = values[key];
    }
    delete next[key];
  }

  return next;
}

export function loadFormValues(): FormValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as FormValues;
    if (!parsed || typeof parsed !== 'object') return {};
    return migrateFormValues(parsed);
  } catch {
    return {};
  }
}

export function saveFormValues(values: FormValues) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    // ignore quota errors
  }
}

export function clearFormValues() {
  localStorage.removeItem(STORAGE_KEY);
}
