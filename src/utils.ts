import { sections } from './data';
import type { FormValues, Section, SectionField, SectionStatus } from './types';

export function isOutbound(values: FormValues): boolean {
  return values.projectType === 'outbound';
}

export function getVisibleSections(values: FormValues) {
  return sections.filter((section) => {
    if (section.conditional === 'outbound') {
      return isOutbound(values);
    }
    return true;
  });
}

export function needsRequestForPill(
  value: FormValues[string],
  includeUnrealistic = false,
  statedField = false,
): boolean {
  if (!value || value === '') return true;
  if (statedField && value === 'missing') return true;
  if (value === 'no' || value === 'unknown') return true;
  if (includeUnrealistic && value === 'unrealistic') return true;
  return false;
}

export function getModuleUsed(values: FormValues, rowId: string): string {
  const used = values[moduleKey(rowId, 'used')];
  return typeof used === 'string' ? used : '';
}

export function isModuleUsedYes(values: FormValues, rowId: string): boolean {
  return getModuleUsed(values, rowId) === 'yes';
}

export function getModuleRowFilled(values: FormValues, rowId: string): boolean {
  const used = getModuleUsed(values, rowId);
  return used.length > 0;
}

export function clearModuleDetails(values: FormValues, rowId: string): FormValues {
  const next = { ...values };
  const suffixes = ['mode', 'ref', 'preprocess', 'slots', 'agents', 'ee', 'examples'];
  for (const suffix of suffixes) {
    delete next[moduleKey(rowId, suffix)];
  }
  return next;
}

function isPillFieldFilled(field: Extract<SectionField, { type: 'pills' }>, values: FormValues): boolean {
  const value = values[field.id];
  if (field.multiple) {
    return Array.isArray(value) && value.length > 0;
  }
  return typeof value === 'string' && value.length > 0 && !needsRequestForPill(value);
}

function countFieldBlocks(field: SectionField, values: FormValues): { filled: number; total: number } {
  switch (field.type) {
    case 'pills':
      return { filled: isPillFieldFilled(field, values) ? 1 : 0, total: 1 };
    case 'checkbox':
      return { filled: values[field.id] === true ? 1 : 0, total: 1 };
    case 'checkbox-group':
      return {
        filled: field.items.filter((item) => values[item.id] === true).length,
        total: field.items.length,
      };
    case 'modules-table':
      return {
        filled: field.rows.filter((row) => getModuleRowFilled(values, row.id)).length,
        total: field.rows.length,
      };
    case 'outbound':
      if (!isOutbound(values)) return { filled: 0, total: 0 };
      return {
        filled:
          (values.outboundTimeRestrictions === true ? 1 : 0) +
          (values.outboundCallbackLogic === true ? 1 : 0) +
          (typeof values.outboundLaunch === 'string' && values.outboundLaunch ? 1 : 0),
        total: 3,
      };
    default:
      return { filled: 0, total: 0 };
  }
}

export function getSectionStatus(section: Section, values: FormValues): SectionStatus {
  let filled = 0;
  let total = 0;

  for (const field of section.fields) {
    const counts = countFieldBlocks(field, values);
    filled += counts.filled;
    total += counts.total;
  }

  if (total === 0) return 'complete';
  if (filled === 0) return 'empty';
  if (filled >= total) return 'complete';
  return 'partial';
}

export function getSectionProgress(section: Section, values: FormValues) {
  let filled = 0;
  let total = 0;

  for (const field of section.fields) {
    const counts = countFieldBlocks(field, values);
    filled += counts.filled;
    total += counts.total;
  }

  return { filled, total, status: getSectionStatus(section, values) };
}

export function getOverallProgress(values: FormValues) {
  const visible = getVisibleSections(values);
  let filled = 0;
  let total = 0;

  for (const section of visible) {
    for (const field of section.fields) {
      const counts = countFieldBlocks(field, values);
      filled += counts.filled;
      total += counts.total;
    }
  }

  return { filled, total };
}

export function getStatusEmoji(status: SectionStatus): string {
  switch (status) {
    case 'complete':
      return '🟢';
    case 'partial':
      return '🟡';
    case 'empty':
      return '🔴';
  }
}

export function togglePill(
  fieldId: string,
  optionId: string,
  multiple: boolean | undefined,
  values: FormValues,
): FormValues {
  if (multiple) {
    const current = Array.isArray(values[fieldId]) ? (values[fieldId] as string[]) : [];
    const next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    return { ...values, [fieldId]: next };
  }

  const current = values[fieldId];
  return {
    ...values,
    [fieldId]: current === optionId ? '' : optionId,
  };
}

export function moduleKey(rowId: string, suffix: string) {
  return `module_${rowId}_${suffix}`;
}
