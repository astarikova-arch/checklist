import { Fragment, useMemo } from 'react';
import { moduleModeOptions, moduleUsageOptions, yesNoOptions } from '../data';
import type { ExpandableRowDef, FormValues, ModuleGroup } from '../types';
import { isRowUsedYes, rowKey } from '../utils';
import { CheckboxRow } from './CheckboxRow';
import { PillGroup } from './PillGroup';

type UsageTableProps = {
  rows: ExpandableRowDef[];
  groups?: ModuleGroup[];
  keyPrefix: 'module' | 'logic';
  values: FormValues;
  agentsAutoSet?: boolean;
  onPillChange: (fieldId: string, optionId: string, multiple?: boolean) => void;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
};

type TableEntry =
  | { kind: 'group'; title: string }
  | { kind: 'row'; row: ExpandableRowDef };

function buildTableEntries(rows: ExpandableRowDef[], groups?: ModuleGroup[]): TableEntry[] {
  if (!groups?.length) {
    return rows.map((row) => ({ kind: 'row', row }));
  }

  const rowMap = new Map(rows.map((row) => [row.id, row]));
  const used = new Set<string>();
  const entries: TableEntry[] = [];

  for (const group of groups) {
    entries.push({ kind: 'group', title: group.title });
    for (const id of group.rowIds) {
      const row = rowMap.get(id);
      if (row) {
        entries.push({ kind: 'row', row });
        used.add(id);
      }
    }
  }

  for (const row of rows) {
    if (!used.has(row.id)) {
      entries.push({ kind: 'row', row });
    }
  }

  return entries;
}

function ModuleRow({
  row,
  keyPrefix,
  values,
  agentsAutoSet,
  onPillChange,
  onCheckboxChange,
}: {
  row: ExpandableRowDef;
  keyPrefix: 'module' | 'logic';
  values: FormValues;
  agentsAutoSet?: boolean;
  onPillChange: UsageTableProps['onPillChange'];
  onCheckboxChange: UsageTableProps['onCheckboxChange'];
}) {
  const usedKey = rowKey(keyPrefix, row.id, 'used');
  const used = typeof values[usedKey] === 'string' ? (values[usedKey] as string) : '';
  const showDetails = isRowUsedYes(values, keyPrefix, row.id);
  const usageOptions = row.yesNoOnly ? yesNoOptions : moduleUsageOptions;
  const modeKey = rowKey(keyPrefix, row.id, 'mode');
  const modeVal = Array.isArray(values[modeKey])
    ? (values[modeKey] as string[])
    : typeof values[modeKey] === 'string' && values[modeKey]
      ? [values[modeKey] as string]
      : [];
  const pillsKey = rowKey(keyPrefix, row.id, 'pills');
  const pillsVal = row.yesPills?.multiple
    ? Array.isArray(values[pillsKey])
      ? (values[pillsKey] as string[])
      : []
    : typeof values[pillsKey] === 'string'
      ? (values[pillsKey] as string)
      : '';
  const slotsKey = rowKey(keyPrefix, row.id, 'slots');
  const slots = typeof values[slotsKey] === 'string' ? (values[slotsKey] as string) : '';
  const useAgentKey = rowKey(keyPrefix, row.id, 'useAgent');
  const useAgent = typeof values[useAgentKey] === 'string' ? (values[useAgentKey] as string) : '';

  const hasDetails =
    !row.noDetailsOnYes &&
    (row.standardDetails ||
      row.durationCheckbox ||
      row.yesCheckbox ||
      row.yesCheckboxes?.length ||
      row.yesPills ||
      row.hasSlotsFlow ||
      row.examplesCheckbox);

  return (
    <Fragment>
      <tr
        id={`field-${usedKey}`}
        className={`field-anchor ${showDetails && hasDetails ? 'modules-table-row--expanded' : ''} ${row.id === 'agents' && agentsAutoSet ? 'modules-table-row--auto' : ''}`}
      >
        <td className="modules-table-name">
          {row.label}
          {row.id === 'agents' && agentsAutoSet && (
            <span className="modules-auto-badge" title="Проставлено из блока «Время / Интервал / Дата»">
              авто
            </span>
          )}
        </td>
        <td>
          <PillGroup
            options={usageOptions}
            value={used}
            onChange={(optionId) => onPillChange(usedKey, optionId)}
          />
        </td>
      </tr>
      {showDetails && hasDetails && (
        <tr className="modules-table-details-row">
          <td colSpan={2}>
            <div className="modules-table-details">
              {row.standardDetails && (
                <>
                  <div className="modules-table-details-section">
                    <span className="modules-table-details-label">Режим (можно несколько)</span>
                    <PillGroup
                      options={moduleModeOptions}
                      value={modeVal}
                      multiple
                      onChange={(optionId) => onPillChange(modeKey, optionId, true)}
                    />
                  </div>
                  <div className="modules-table-details-section">
                    <span className="modules-table-details-label">Опции</span>
                    <div className="modules-table-checks">
                      <CheckboxRow
                        id={rowKey(keyPrefix, row.id, 'ref')}
                        label="Сверка со справочником"
                        compact
                        checked={values[rowKey(keyPrefix, row.id, 'ref')] === true}
                        onChange={(checked) =>
                          onCheckboxChange(rowKey(keyPrefix, row.id, 'ref'), checked)
                        }
                      />
                      <CheckboxRow
                        id={rowKey(keyPrefix, row.id, 'preprocess')}
                        label="Нужна предобработка"
                        compact
                        checked={values[rowKey(keyPrefix, row.id, 'preprocess')] === true}
                        onChange={(checked) =>
                          onCheckboxChange(rowKey(keyPrefix, row.id, 'preprocess'), checked)
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {row.hasSlotsFlow && (
                <div className="modules-table-details-section modules-table-details-section--wide">
                  <span className="modules-table-details-label">Слоты</span>
                  <PillGroup
                    options={moduleUsageOptions}
                    value={slots}
                    onChange={(optionId) => onPillChange(slotsKey, optionId)}
                  />
                  {slots === 'yes' && (
                    <div className="modules-table-slots-agent">
                      <span className="modules-table-details-label">Будет использоваться агент?</span>
                      <PillGroup
                        options={moduleUsageOptions}
                        value={useAgent}
                        onChange={(optionId) => onPillChange(useAgentKey, optionId)}
                      />
                    </div>
                  )}
                </div>
              )}

              {row.durationCheckbox && (
                <div className="modules-table-details-section">
                  <CheckboxRow
                    id={rowKey(keyPrefix, row.id, 'flag')}
                    label={row.durationCheckbox}
                    checked={values[rowKey(keyPrefix, row.id, 'flag')] === true}
                    onChange={(checked) =>
                      onCheckboxChange(rowKey(keyPrefix, row.id, 'flag'), checked)
                    }
                  />
                </div>
              )}

              {row.yesCheckbox && (
                <div className="modules-table-details-section">
                  <CheckboxRow
                    id={rowKey(keyPrefix, row.id, 'flag')}
                    label={row.yesCheckbox}
                    checked={values[rowKey(keyPrefix, row.id, 'flag')] === true}
                    onChange={(checked) =>
                      onCheckboxChange(rowKey(keyPrefix, row.id, 'flag'), checked)
                    }
                  />
                </div>
              )}

              {row.yesCheckboxes && (
                <div className="modules-table-details-section modules-table-details-section--wide">
                  <span className="modules-table-details-label">Детали</span>
                  <div className="modules-table-checks">
                    {row.yesCheckboxes.map((item) => (
                      <CheckboxRow
                        key={item.id}
                        id={rowKey(keyPrefix, row.id, item.id)}
                        label={item.label}
                        compact
                        checked={values[rowKey(keyPrefix, row.id, item.id)] === true}
                        onChange={(checked) =>
                          onCheckboxChange(rowKey(keyPrefix, row.id, item.id), checked)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {row.yesPills && (
                <div className="modules-table-details-section modules-table-details-section--wide">
                  <span className="modules-table-details-label">{row.yesPills.label}</span>
                  <PillGroup
                    options={row.yesPills.options}
                    value={pillsVal}
                    multiple={row.yesPills.multiple}
                    onChange={(optionId) => onPillChange(pillsKey, optionId, row.yesPills?.multiple)}
                  />
                </div>
              )}

              {row.examplesCheckbox && (
                <div className="modules-table-details-section">
                  <CheckboxRow
                    id={rowKey(keyPrefix, row.id, 'examples')}
                    label={row.examplesCheckbox}
                    checked={values[rowKey(keyPrefix, row.id, 'examples')] === true}
                    onChange={(checked) =>
                      onCheckboxChange(rowKey(keyPrefix, row.id, 'examples'), checked)
                    }
                  />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}

export function UsageTable({
  rows,
  groups,
  keyPrefix,
  values,
  agentsAutoSet,
  onPillChange,
  onCheckboxChange,
}: UsageTableProps) {
  const entries = useMemo(() => buildTableEntries(rows, groups), [rows, groups]);

  return (
    <div className="modules-table-wrap">
      <table className="modules-table">
        <thead>
          <tr>
            <th>Поле</th>
            <th>Используется?</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) =>
            entry.kind === 'group' ? (
              <tr key={`group-${entry.title}`} className="modules-table-group-row">
                <td colSpan={2}>{entry.title}</td>
              </tr>
            ) : (
              <ModuleRow
                key={entry.row.id}
                row={entry.row}
                keyPrefix={keyPrefix}
                values={values}
                agentsAutoSet={agentsAutoSet}
                onPillChange={onPillChange}
                onCheckboxChange={onCheckboxChange}
              />
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
