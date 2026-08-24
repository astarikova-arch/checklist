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

export type PillWithDetailsField = FieldBase & {
  type: 'pill-with-details';
  options: PillOption[];
  detailsOnYes?: { id: string; label: string }[];
  detailsOnNo?: { id: string; label: string }[];
  /** В список уточнений попадает только «Неизвестно», ответ «Нет» — ок */
  requestOnUnknownOnly?: boolean;
};

export type CheckboxField = FieldBase & {
  type: 'checkbox';
  checkboxLabel: string;
};

export type CheckboxGroupField = FieldBase & {
  type: 'checkbox-group';
  items: { id: string; label: string }[];
};

export type MaterialItemDef = {
  id: string;
  label: string;
  deviationCheckbox?: string;
};

export type MaterialsField = FieldBase & {
  type: 'materials';
  items: MaterialItemDef[];
};

export type DataWorkSubItem = {
  id: string;
  label: string;
  /** Только для исходящих проектов */
  outboundOnly?: boolean;
  /** Да / Нет / Неизвестно перед деталями */
  hasUsedPills?: boolean;
  method?: {
    label?: string;
    options: PillOption[];
    /** Значение, при котором показываем чекбокс документации */
    apiOptionId?: string;
  };
  examplesCheckbox?: string;
  docsCheckbox?: string;
  /** Чекбокс предобработки / постобработки */
  processCheckbox?: string;
};

export type DataWorkField = FieldBase & {
  type: 'data-work';
  subItems: DataWorkSubItem[];
};

export type ExpandableRowDef = {
  id: string;
  label: string;
  /** Форма для «работать с …» в вопросах клиенту */
  workWithLabel?: string;
  standardDetails?: boolean;
  hasSlotsFlow?: boolean;
  examplesCheckbox?: string;
  durationCheckbox?: string;
  yesCheckbox?: string;
  yesCheckboxes?: { id: string; label: string }[];
  yesPills?: {
    label: string;
    options: PillOption[];
    multiple?: boolean;
  };
  yesNoOnly?: boolean;
  /** Без деталей при «Да» — только выбор использования */
  noDetailsOnYes?: boolean;
};

export type UsageTableField = FieldBase & {
  type: 'usage-table';
  keyPrefix: 'module' | 'logic';
  rows: ExpandableRowDef[];
  groups?: ModuleGroup[];
};

export type AnalyticsField = FieldBase & {
  type: 'analytics';
  formatOptions: PillOption[];
};

export type OutboundField = FieldBase & {
  type: 'outbound';
};

export type OperatorTransferField = FieldBase & {
  type: 'operator-transfer';
};

export type SectionField =
  | PillField
  | PillWithDetailsField
  | CheckboxField
  | CheckboxGroupField
  | MaterialsField
  | DataWorkField
  | UsageTableField
  | AnalyticsField
  | OutboundField
  | OperatorTransferField;

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
  scrollTarget?: string;
};

export type ModuleGroup = {
  title: string;
  rowIds: string[];
};

export type RequestGroup = {
  id: string;
  title: string;
  items: RequestItem[];
};

export type FormValues = Record<string, string | string[] | boolean>;
