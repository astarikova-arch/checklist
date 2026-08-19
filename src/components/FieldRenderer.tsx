import type {
  CheckboxField as CheckboxFieldType,
  CheckboxGroupField,
  DataWorkField,
  AnalyticsField,
  FormValues,
  MaterialsField,
  OutboundField,
  PillField,
  PillWithDetailsField,
  SectionField,
  UsageTableField,
} from '../types';
import { AnalyticsBlock } from './AnalyticsBlock';
import { DataWorkBlock } from './DataWorkBlock';
import { OperatorTransferBlock } from './OperatorTransferBlock';
import { CheckboxRow } from './CheckboxRow';
import { MaterialsBlock } from './MaterialsBlock';
import { OutboundBlock } from './OutboundBlock';
import { PillGroup } from './PillGroup';
import { UsageTable } from './UsageTable';

function pillValue(values: FormValues, fieldId: string, multiple?: boolean): string | string[] {
  const value = values[fieldId];
  if (multiple) {
    return Array.isArray(value) ? value : [];
  }
  return typeof value === 'string' ? value : '';
}

type FieldRendererProps = {
  field: SectionField;
  values: FormValues;
  agentsAutoSet?: boolean;
  onPillChange: (fieldId: string, optionId: string, multiple?: boolean) => void;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
  onTextChange: (fieldId: string, text: string) => void;
};

export function FieldRenderer({
  field,
  values,
  agentsAutoSet,
  onPillChange,
  onCheckboxChange,
}: FieldRendererProps) {
  if (field.type === 'pills') {
    const pillField = field as PillField;
    return (
      <div className="field-row field-row--compact field-anchor" id={`field-${field.id}`}>
        <div className="field-label field-label--compact">{field.label}</div>
        <div className="field-control">
          <PillGroup
            options={pillField.options}
            value={pillValue(values, field.id, pillField.multiple)}
            multiple={pillField.multiple}
            onChange={(optionId) => onPillChange(field.id, optionId, pillField.multiple)}
          />
        </div>
      </div>
    );
  }

  if (field.type === 'pill-with-details') {
    const detailField = field as PillWithDetailsField;
    const value = pillValue(values, field.id) as string;
    const showYes = value === 'yes' && detailField.detailsOnYes?.length;
    const showNo = value === 'no' && detailField.detailsOnNo?.length;

    return (
      <div className="field-block field-anchor" id={`field-${field.id}`}>
        <div className="field-row field-row--compact">
          <div className="field-label field-label--compact">{field.label}</div>
          <div className="field-control">
            <PillGroup
              options={detailField.options}
              value={value}
              onChange={(optionId) => onPillChange(field.id, optionId)}
            />
          </div>
        </div>
        {(showYes || showNo) && (
          <div className="field-details field-details--compact">
            {(showYes ? detailField.detailsOnYes : detailField.detailsOnNo)?.map((item) => (
              <div key={item.id} id={`field-${item.id}`} className="field-anchor">
                <CheckboxRow
                  id={item.id}
                  label={item.label}
                  compact
                  checked={values[item.id] === true}
                  onChange={(checked) => onCheckboxChange(item.id, checked)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    const checkboxField = field as CheckboxFieldType;
    return (
      <div className="field-row field-row--checkbox-only field-anchor" id={`field-${field.id}`}>
        <CheckboxRow
          id={field.id}
          label={checkboxField.checkboxLabel}
          checked={values[field.id] === true}
          onChange={(checked) => onCheckboxChange(field.id, checked)}
        />
      </div>
    );
  }

  if (field.type === 'checkbox-group') {
    const groupField = field as CheckboxGroupField;
    return (
      <div className="field-row field-row--faq field-anchor" id={`field-${field.id}`}>
        <div className="field-label field-label--compact">{field.label}</div>
        <div className="field-control field-control--faq">
          {groupField.items.map((item) => (
            <CheckboxRow
              key={item.id}
              id={item.id}
              label={item.label}
              checked={values[item.id] === true}
              onChange={(checked) => onCheckboxChange(item.id, checked)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'materials') {
    const materialsField = field as MaterialsField;
    return (
      <MaterialsBlock
        items={materialsField.items}
        values={values}
        onPillChange={(fieldId, optionId) => onPillChange(fieldId, optionId)}
        onCheckboxChange={onCheckboxChange}
      />
    );
  }

  if (field.type === 'data-work') {
    const dataField = field as DataWorkField;
    return (
      <DataWorkBlock
        label={dataField.label}
        subItems={dataField.subItems}
        outboundCheckbox={dataField.outboundCheckbox}
        values={values}
        onPillChange={onPillChange}
        onCheckboxChange={onCheckboxChange}
      />
    );
  }

  if (field.type === 'operator-transfer') {
    return (
      <OperatorTransferBlock
        values={values}
        onPillChange={onPillChange}
        onCheckboxChange={onCheckboxChange}
      />
    );
  }

  if (field.type === 'usage-table') {
    const tableField = field as UsageTableField;
    return (
      <UsageTable
        rows={tableField.rows}
        groups={tableField.groups}
        keyPrefix={tableField.keyPrefix}
        values={values}
        agentsAutoSet={agentsAutoSet}
        onPillChange={onPillChange}
        onCheckboxChange={onCheckboxChange}
      />
    );
  }

  if (field.type === 'analytics') {
    const analyticsField = field as AnalyticsField;
    return (
      <AnalyticsBlock
        formatOptions={analyticsField.formatOptions}
        values={values}
        onPillChange={onPillChange}
      />
    );
  }

  if (field.type === 'outbound') {
    return (
      <OutboundBlock
        values={values}
        onCheckboxChange={onCheckboxChange}
        onPillChange={(fieldId, optionId) => onPillChange(fieldId, optionId)}
      />
    );
  }

  return null;
}
