import type { FormValues } from './types';

const STORAGE_KEY = 'automation-checklist-v1';

export function loadFormValues(): FormValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as FormValues;
    return parsed && typeof parsed === 'object' ? parsed : {};
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
