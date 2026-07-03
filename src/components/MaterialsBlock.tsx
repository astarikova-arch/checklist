import { moduleUsageOptions } from '../data';
import type { MaterialItemDef, FormValues } from '../types';
import { CheckboxRow } from './CheckboxRow';
import { PillGroup } from './PillGroup';

type MaterialsBlockProps = {
  items: MaterialItemDef[];
  values: FormValues;
  onPillChange: (fieldId: string, optionId: string) => void;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
};

export function MaterialsBlock({
  items,
  values,
  onPillChange,
  onCheckboxChange,
}: MaterialsBlockProps) {
  return (
    <div className="materials-block">
      {items.map((item) => {
        const value = typeof values[item.id] === 'string' ? (values[item.id] as string) : '';
        const deviationId = `${item.id}Deviation`;

        return (
          <div key={item.id} className="field-block field-anchor" id={`field-${item.id}`}>
            <div className="field-row field-row--compact">
              <div className="field-label field-label--compact">{item.label}</div>
              <div className="field-control">
                <PillGroup
                  options={moduleUsageOptions}
                  value={value}
                  onChange={(optionId) => onPillChange(item.id, optionId)}
                />
              </div>
            </div>
            {value === 'yes' && item.deviationCheckbox && (
              <div className="field-details field-details--compact field-anchor" id={`field-${deviationId}`}>
                <CheckboxRow
                  id={deviationId}
                  label={item.deviationCheckbox}
                  compact
                  checked={values[deviationId] === true}
                  onChange={(checked) => onCheckboxChange(deviationId, checked)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
