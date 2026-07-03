import { dataWorkSubItems, sectionLayoutPairs, sections } from './data';
import type { ExpandableRowDef, FormValues, Section, SectionField, SectionStatus } from './types';

export type SectionLayoutItem = Section | Section[];

export function layoutSections(visible: Section[]): SectionLayoutItem[] {
  const byId = new Map(visible.map((section) => [section.id, section]));
  const used = new Set<string>();
  const result: SectionLayoutItem[] = [];

  for (const section of visible) {
    if (used.has(section.id)) continue;

    const pair = sectionLayoutPairs.find(([a, b]) => a === section.id || b === section.id);
    if (pair) {
      const [leftId, rightId] = pair;
      const left = byId.get(leftId);
      const right = byId.get(rightId);
      if (left && right) {
        result.push([left, right]);
        used.add(leftId);
        used.add(rightId);
        continue;
      }
    }

    result.push(section);
    used.add(section.id);
  }

  return result;
}

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

export function needsRequestForUnknownOnly(value: FormValues[string]): boolean {
  return !value || value === '' || value === 'unknown';
}

export function rowKey(prefix: string, rowId: string, suffix: string) {
  return `${prefix}_${rowId}_${suffix}`;
}

export function moduleKey(rowId: string, suffix: string) {
  return rowKey('module', rowId, suffix);
}

export function logicKey(rowId: string, suffix: string) {
  return rowKey('logic', rowId, suffix);
}

export function getRowUsed(values: FormValues, prefix: string, rowId: string): string {
  const used = values[rowKey(prefix, rowId, 'used')];
  return typeof used === 'string' ? used : '';
}

export function isRowUsedYes(values: FormValues, prefix: string, rowId: string): boolean {
  return getRowUsed(values, prefix, rowId) === 'yes';
}

export function getRowFilled(values: FormValues, prefix: string, rowId: string): boolean {
  return getRowUsed(values, prefix, rowId).length > 0;
}

export function clearRowDetails(
  values: FormValues,
  prefix: string,
  row: ExpandableRowDef,
): FormValues {
  const next = { ...values };
  const suffixes = [
    'mode',
    'ref',
    'preprocess',
    'slots',
    'useAgent',
    'examples',
    'flag',
    'pills',
  ];

  for (const suffix of suffixes) {
    delete next[rowKey(prefix, row.id, suffix)];
  }

  if (row.yesCheckboxes) {
    for (const item of row.yesCheckboxes) {
      delete next[rowKey(prefix, row.id, item.id)];
    }
  }

  return next;
}

export function clearPillDetails(values: FormValues, _fieldId: string, detailIds: string[]): FormValues {
  const next = { ...values };
  for (const id of detailIds) {
    delete next[id];
  }
  return next;
}

export function clearDataWorkDetails(values: FormValues): FormValues {
  const next = { ...values };
  delete next.logic_dataWork_phoneInfo;

  for (const item of dataWorkSubItems) {
    delete next[logicKey(item.id, 'flag')];
    delete next[logicKey(item.id, 'pills')];
  }

  return next;
}

export function isRowAnsweredComplete(
  values: FormValues,
  prefix: 'module' | 'logic',
  row: ExpandableRowDef,
): boolean {
  const used = getRowUsed(values, prefix, row.id);
  if (!used) return false;
  if (used === 'no' || used === 'unknown') return true;
  if (row.noDetailsOnYes) return true;

  if (row.standardDetails) {
    const mode = values[rowKey(prefix, row.id, 'mode')];
    if (!Array.isArray(mode) || mode.length === 0) return false;
  }

  if (row.examplesCheckbox && values[rowKey(prefix, row.id, 'examples')] !== true) return false;
  if (row.durationCheckbox && values[rowKey(prefix, row.id, 'flag')] !== true) return false;
  if (row.yesCheckbox && values[rowKey(prefix, row.id, 'flag')] !== true) return false;

  if (row.yesCheckboxes) {
    for (const item of row.yesCheckboxes) {
      if (values[rowKey(prefix, row.id, item.id)] !== true) return false;
    }
  }

  if (row.yesPills) {
    const pills = values[rowKey(prefix, row.id, 'pills')];
    if (!Array.isArray(pills) || pills.length === 0) return false;
  }

  if (row.hasSlotsFlow) {
    const slots = values[rowKey(prefix, row.id, 'slots')];
    if (!slots) return false;
    if (slots === 'yes') {
      const useAgent = values[rowKey(prefix, row.id, 'useAgent')];
      if (!useAgent) return false;
    }
  }

  return true;
}

function isDataWorkComplete(values: FormValues): boolean {
  const used = values.logic_dataWork_used;
  if (typeof used !== 'string' || !used) return false;
  if (used === 'no' || used === 'unknown') return true;

  for (const item of dataWorkSubItems) {
    if (item.yesCheckbox && values[logicKey(item.id, 'flag')] !== true) return false;
    if (item.yesPills) {
      const pills = values[logicKey(item.id, 'pills')];
      if (!Array.isArray(pills) || pills.length === 0) return false;
    }
  }

  if (isOutbound(values) && values.logic_dataWork_phoneInfo !== true) return false;
  return true;
}

function isPillFieldFilled(field: Extract<SectionField, { type: 'pills' }>, values: FormValues): boolean {
  const value = values[field.id];
  if (field.multiple) {
    return Array.isArray(value) && value.length > 0;
  }
  return typeof value === 'string' && value.length > 0 && !needsRequestForPill(value);
}

function isPillWithDetailsFilled(
  field: Extract<SectionField, { type: 'pill-with-details' }>,
  values: FormValues,
): boolean {
  const value = values[field.id];
  if (typeof value !== 'string' || !value.length) return false;
  if (field.requestOnUnknownOnly) {
    return value === 'yes' || value === 'no';
  }
  return !needsRequestForPill(value);
}

function countFieldBlocks(field: SectionField, values: FormValues): { filled: number; total: number } {
  switch (field.type) {
    case 'pills':
      return { filled: isPillFieldFilled(field, values) ? 1 : 0, total: 1 };
    case 'pill-with-details':
      return { filled: isPillWithDetailsFilled(field, values) ? 1 : 0, total: 1 };
    case 'checkbox':
      return { filled: values[field.id] === true ? 1 : 0, total: 1 };
    case 'checkbox-group':
      return {
        filled: field.items.filter((item) => values[item.id] === true).length,
        total: field.items.length,
      };
    case 'materials':
      return {
        filled: field.items.filter((item) => {
          const v = values[item.id];
          return typeof v === 'string' && v.length > 0;
        }).length,
        total: field.items.length,
      };
    case 'data-work':
      return { filled: isDataWorkComplete(values) ? 1 : 0, total: 1 };
    case 'usage-table':
      return {
        filled: field.rows.filter((row) => isRowAnsweredComplete(values, field.keyPrefix, row)).length,
        total: field.rows.length,
      };
    case 'outbound':
      if (!isOutbound(values)) return { filled: 0, total: 0 };
      return {
        filled:
          (typeof values.outboundTimeUsed === 'string' && values.outboundTimeUsed ? 1 : 0) +
          (typeof values.outboundCallbackUsed === 'string' && values.outboundCallbackUsed ? 1 : 0) +
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
