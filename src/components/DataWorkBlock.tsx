import { moduleUsageOptions } from '../data';
import type { DataWorkSubItem, FormValues } from '../types';
import { isOutbound, logicKey } from '../utils';
import { CheckboxRow } from './CheckboxRow';
import { PillGroup } from './PillGroup';

type DataWorkBlockProps = {
  label: string;
  subItems: DataWorkSubItem[];
  values: FormValues;
  onPillChange: (fieldId: string, optionId: string, multiple?: boolean) => void;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
};

function stringValue(values: FormValues, key: string): string {
  const value = values[key];
  return typeof value === 'string' ? value : '';
}

function DataWorkSub({
  item,
  values,
  onPillChange,
  onCheckboxChange,
}: {
  item: DataWorkSubItem;
  values: FormValues;
  onPillChange: DataWorkBlockProps['onPillChange'];
  onCheckboxChange: DataWorkBlockProps['onCheckboxChange'];
}) {
  const usedKey = logicKey(item.id, 'used');
  const methodKey = logicKey(item.id, 'method');
  const examplesKey = logicKey(item.id, 'examples');
  const docsKey = logicKey(item.id, 'docs');
  const used = stringValue(values, usedKey);
  const method = stringValue(values, methodKey);
  const showDetails = !item.hasUsedPills || used === 'yes';
  const showDocs =
    Boolean(item.docsCheckbox && item.method?.apiOptionId) && method === item.method?.apiOptionId;

  return (
    <div className="data-work-sub">
      <div className="data-work-sub-title">{item.label}</div>

      {item.hasUsedPills && (
        <div className="data-work-sub-pills field-anchor" id={`field-${usedKey}`}>
          <PillGroup
            options={moduleUsageOptions}
            value={used}
            onChange={(optionId) => onPillChange(usedKey, optionId)}
          />
        </div>
      )}

      {showDetails && (
        <>
          {item.method && (
            <div className="data-work-sub-pills field-anchor" id={`field-${methodKey}`}>
              {item.method.label && (
                <span className="modules-table-details-label">{item.method.label}</span>
              )}
              <PillGroup
                options={item.method.options}
                value={method}
                onChange={(optionId) => onPillChange(methodKey, optionId)}
              />
            </div>
          )}

          {item.examplesCheckbox && (
            <div className="field-anchor" id={`field-${examplesKey}`}>
              <CheckboxRow
                id={examplesKey}
                label={item.examplesCheckbox}
                compact
                checked={values[examplesKey] === true}
                onChange={(checked) => onCheckboxChange(examplesKey, checked)}
              />
            </div>
          )}

          {showDocs && item.docsCheckbox && (
            <div className="field-anchor" id={`field-${docsKey}`}>
              <CheckboxRow
                id={docsKey}
                label={item.docsCheckbox}
                compact
                checked={values[docsKey] === true}
                onChange={(checked) => onCheckboxChange(docsKey, checked)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function DataWorkBlock({
  label,
  subItems,
  values,
  onPillChange,
  onCheckboxChange,
}: DataWorkBlockProps) {
  const used = stringValue(values, 'logic_dataWork_used');
  const showDetails = used === 'yes';
  const outbound = isOutbound(values);
  const visibleItems = subItems.filter((item) => !item.outboundOnly || outbound);

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
          {visibleItems.map((item) => (
            <DataWorkSub
              key={item.id}
              item={item}
              values={values}
              onPillChange={onPillChange}
              onCheckboxChange={onCheckboxChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
