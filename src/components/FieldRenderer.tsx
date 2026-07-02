import type {
  CheckboxField as CheckboxFieldType,
  CheckboxGroupField,
  FormValues,
  ModulesTableField,
  OutboundField,
  PillField,
  SectionField,
} from '../types';
import { CheckboxRow } from './CheckboxRow';
import { ModulesTable } from './ModulesTable';
import { OutboundBlock } from './OutboundBlock';
import { PillGroup } from './PillGroup';

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
  onPillChange: (fieldId: string, optionId: string, multiple?: boolean) => void;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
  onTextChange: (fieldId: string, text: string) => void;
};

export function FieldRenderer({
  field,
  values,
  onPillChange,
  onCheckboxChange,
  onTextChange,
}: FieldRendererProps) {
  if (field.type === 'pills') {
    const pillField = field as PillField;
    return (
      <div className="field-row">
        <div className="field-label">{field.label}</div>
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

  if (field.type === 'checkbox') {
    const checkboxField = field as CheckboxFieldType;
    return (
      <div className="field-row">
        <div className="field-label">{field.label}</div>
        <div className="field-control">
          <CheckboxRow
            id={field.id}
            label={checkboxField.checkboxLabel}
            checked={values[field.id] === true}
            onChange={(checked) => onCheckboxChange(field.id, checked)}
          />
        </div>
      </div>
    );
  }

  if (field.type === 'checkbox-group') {
    const groupField = field as CheckboxGroupField;
    return (
      <div className="field-row field-row--faq">
        <div className="field-label">{field.label}</div>
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

  if (field.type === 'modules-table') {
    const tableField = field as ModulesTableField;
    return (
      <ModulesTable
        rows={tableField.rows}
        values={values}
        onPillChange={(fieldId, optionId) => onPillChange(fieldId, optionId)}
        onCheckboxChange={onCheckboxChange}
        onTextChange={onTextChange}
      />
    );
  }

  const outboundField = field as OutboundField;
  if (outboundField.type === 'outbound') {
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
