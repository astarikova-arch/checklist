import { Fragment } from 'react';
import { moduleModeOptions, moduleUsageOptions } from '../data';
import type { FormValues, ModuleRowDef } from '../types';
import { isModuleUsedYes, moduleKey } from '../utils';
import { CheckboxRow } from './CheckboxRow';
import { PillGroup } from './PillGroup';

type ModulesTableProps = {
  rows: ModuleRowDef[];
  values: FormValues;
  onPillChange: (fieldId: string, optionId: string) => void;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
  onTextChange: (fieldId: string, text: string) => void;
};

export function ModulesTable({
  rows,
  values,
  onPillChange,
  onCheckboxChange,
  onTextChange,
}: ModulesTableProps) {
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
          {rows.map((row) => {
            const usedKey = moduleKey(row.id, 'used');
            const used = typeof values[usedKey] === 'string' ? (values[usedKey] as string) : '';
            const showDetails = isModuleUsedYes(values, row.id);
            const modeKey = moduleKey(row.id, 'mode');
            const mode = typeof values[modeKey] === 'string' ? (values[modeKey] as string) : '';

            return (
              <Fragment key={row.id}>
                <tr className={showDetails ? 'modules-table-row--expanded' : ''}>
                  <td className="modules-table-name">{row.label}</td>
                  <td>
                    <PillGroup
                      options={moduleUsageOptions}
                      value={used}
                      onChange={(optionId) => onPillChange(usedKey, optionId)}
                    />
                  </td>
                </tr>
                {showDetails && (
                  <tr className="modules-table-details-row">
                    <td colSpan={2}>
                      <div className="modules-table-details">
                        <div className="modules-table-details-section">
                          <span className="modules-table-details-label">Режим</span>
                          <PillGroup
                            options={moduleModeOptions}
                            value={mode}
                            onChange={(optionId) => onPillChange(modeKey, optionId)}
                          />
                        </div>
                        <div className="modules-table-details-section">
                          <span className="modules-table-details-label">Опции</span>
                          <div className="modules-table-checks">
                            <CheckboxRow
                              id={moduleKey(row.id, 'ref')}
                              label="Сверка со справочником"
                              compact
                              checked={values[moduleKey(row.id, 'ref')] === true}
                              onChange={(checked) =>
                                onCheckboxChange(moduleKey(row.id, 'ref'), checked)
                              }
                            />
                            <CheckboxRow
                              id={moduleKey(row.id, 'preprocess')}
                              label="Нужна предобработка"
                              compact
                              checked={values[moduleKey(row.id, 'preprocess')] === true}
                              onChange={(checked) =>
                                onCheckboxChange(moduleKey(row.id, 'preprocess'), checked)
                              }
                            />
                          </div>
                        </div>
                        {(row.hasTimeExtras || row.hasExamples) && (
                          <div className="modules-table-details-section modules-table-details-section--wide">
                            <span className="modules-table-details-label">Дополнительно</span>
                            {row.hasTimeExtras && (
                              <div className="modules-table-extras">
                                <label className="inline-field">
                                  <span>Слоты?</span>
                                  <input
                                    type="text"
                                    value={(values[moduleKey(row.id, 'slots')] as string) ?? ''}
                                    onChange={(e) =>
                                      onTextChange(moduleKey(row.id, 'slots'), e.target.value)
                                    }
                                    placeholder="—"
                                  />
                                </label>
                                <label className="inline-field">
                                  <span>Нужны агенты?</span>
                                  <input
                                    type="text"
                                    value={(values[moduleKey(row.id, 'agents')] as string) ?? ''}
                                    onChange={(e) =>
                                      onTextChange(moduleKey(row.id, 'agents'), e.target.value)
                                    }
                                    placeholder="—"
                                  />
                                </label>
                                <label className="inline-field">
                                  <span>Наша ЭЭ</span>
                                  <input
                                    type="text"
                                    value={(values[moduleKey(row.id, 'ee')] as string) ?? ''}
                                    onChange={(e) =>
                                      onTextChange(moduleKey(row.id, 'ee'), e.target.value)
                                    }
                                    placeholder="—"
                                  />
                                </label>
                              </div>
                            )}
                            {row.hasExamples && (
                              <label className="inline-field inline-field--wide">
                                <span>Примеры данных</span>
                                <input
                                  type="text"
                                  value={(values[moduleKey(row.id, 'examples')] as string) ?? ''}
                                  onChange={(e) =>
                                    onTextChange(moduleKey(row.id, 'examples'), e.target.value)
                                  }
                                  placeholder="Вставьте примеры"
                                />
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
