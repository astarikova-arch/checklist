export type PillOption = {
  id: string;
  label: string;
};

export type FieldBase = {
  id: string;
  label: string;
};

export type PillField = FieldBase & {
  type: 'pills';
  options: PillOption[];
  multiple?: boolean;
};

export type CheckboxField = FieldBase & {
  type: 'checkbox';
  checkboxLabel: string;
};

export type CheckboxGroupField = FieldBase & {
  type: 'checkbox-group';
  items: { id: string; label: string }[];
};

export type ModuleRowDef = {
  id: string;
  label: string;
  hasTimeExtras?: boolean;
  hasExamples?: boolean;
};

export type ModulesTableField = FieldBase & {
  type: 'modules-table';
  rows: ModuleRowDef[];
};

export type OutboundField = FieldBase & {
  type: 'outbound';
};

export type SectionField =
  | PillField
  | CheckboxField
  | CheckboxGroupField
  | ModulesTableField
  | OutboundField;

export type Section = {
  id: string;
  number: number;
  title: string;
  fields: SectionField[];
  conditional?: 'outbound';
};

export type SectionStatus = 'empty' | 'partial' | 'complete';

export type RequestItem = {
  id: string;
  text: string;
};

export type RequestGroup = {
  id: string;
  title: string;
  items: RequestItem[];
};

export type FormValues = Record<string, string | string[] | boolean>;
