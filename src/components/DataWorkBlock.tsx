import { moduleUsageOptions } from '../data';
import type { DataWorkSubItem, FormValues } from '../types';
import { isOutbound } from '../utils';
import { CheckboxRow } from './CheckboxRow';
import { PillGroup } from './PillGroup';

type DataWorkBlockProps = {
  label: string;
  subItems: DataWorkSubItem[];
  outboundCheckbox?: string;
  values: FormValues;
  onPillChange: (fieldId: string, optionId: string, multiple?: boolean) => void;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
};

function subKey(subId: string, suffix: string) {
  return `logic_${subId}_${suffix}`;
}

export function DataWorkBlock({
  label,
  subItems,
  outboundCheckbox,
  values,
  onPillChange,
  onCheckboxChange,
}: DataWorkBlockProps) {
  const used = typeof values.logic_dataWork_used === 'string' ? values.logic_dataWork_used : '';
  const showDetails = used === 'yes';
  const outbound = isOutbound(values);

  return (
    <div className="data-work-block field-anchor" id="field-logic_dataWork_used">
      <div className="field-row field-row--compact">
        <div className="field-label field-label--compact">{label}</div>
        <div className="field-control">
          <PillGroup
            options={moduleUsageOptions}
            value={used}
            onChange={(optionId) => onPillChange('logic_dataWork_used', optionId)}
          />
        </div>
      </div>

      {showDetails && (
        <div className="data-work-details">
          {subItems.map((item) => {
            const pillsKey = subKey(item.id, 'pills');
            const pillsVal = item.yesPills?.multiple
              ? Array.isArray(values[pillsKey])
                ? (values[pillsKey] as string[])
                : []
              : [];

            return (
              <div key={item.id} className="data-work-sub">
                <div className="data-work-sub-title">{item.label}</div>
                {item.yesCheckbox && (
                  <div className="field-anchor" id={`field-${subKey(item.id, 'flag')}`}>
                    <CheckboxRow
                      id={subKey(item.id, 'flag')}
                      label={item.yesCheckbox}
                      compact
                      checked={values[subKey(item.id, 'flag')] === true}
                      onChange={(checked) => onCheckboxChange(subKey(item.id, 'flag'), checked)}
                    />
                  </div>
                )}
                {item.yesPills && (
                  <div className="data-work-sub-pills field-anchor" id={`field-${pillsKey}`}>
                    <span className="modules-table-details-label">{item.yesPills.label}</span>
                    <PillGroup
                      options={item.yesPills.options}
                      value={pillsVal}
                      multiple={item.yesPills.multiple}
                      onChange={(optionId) =>
                        onPillChange(pillsKey, optionId, item.yesPills?.multiple)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}

          {outbound && outboundCheckbox && (
            <div className="data-work-sub field-anchor" id="field-logic_dataWork_phoneInfo">
              <CheckboxRow
                id="logic_dataWork_phoneInfo"
                label={outboundCheckbox}
                compact
                checked={values.logic_dataWork_phoneInfo === true}
                onChange={(checked) => onCheckboxChange('logic_dataWork_phoneInfo', checked)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
