import type { DataWorkSubItem, ExpandableRowDef, ModuleGroup, Section } from './types';

const yesNoUnknown = [
  { id: 'yes', label: 'Да' },
  { id: 'no', label: 'Нет' },
  { id: 'unknown', label: 'Неизвестно' },
];

const yesNo = [
  { id: 'yes', label: 'Да' },
  { id: 'no', label: 'Нет' },
];

const existsOptions = [
  { id: 'yes', label: 'Да' },
  { id: 'no', label: 'Нет' },
  { id: 'unknown', label: 'Неизвестно' },
];

const realisticOptions = [
  { id: 'realistic', label: 'Реалистичны' },
  { id: 'unrealistic', label: 'Нереалистичны' },
  { id: 'unknown', label: 'Неизвестно' },
];

export const moduleGroups: ModuleGroup[] = [
  {
    title: 'Контактные данные',
    rowIds: ['fio', 'region', 'city', 'address', 'phone', 'email'],
  },
  { title: 'Время и дата', rowIds: ['time'] },
  {
    title: 'Заказ и сценарий',
    rowIds: ['product', 'order', 'survey', 'rating', 'agents'],
  },
];

export const moduleRows: ExpandableRowDef[] = [
  { id: 'fio', label: 'ФИО', standardDetails: true },
  { id: 'region', label: 'Регион', standardDetails: true },
  { id: 'city', label: 'Город', standardDetails: true },
  { id: 'address', label: 'Адрес', standardDetails: true },
  { id: 'phone', label: 'Телефон', standardDetails: true },
  { id: 'email', label: 'E-mail', standardDetails: true },
  {
    id: 'time',
    label: 'Время / Интервал / Дата',
    standardDetails: true,
    hasSlotsFlow: true,
  },
  {
    id: 'product',
    label: 'Услуга / Товар',
    standardDetails: true,
    examplesCheckbox: 'Примеры данных указаны',
  },
  {
    id: 'order',
    label: 'Номер заказа / накладной / договора',
    standardDetails: true,
    examplesCheckbox: 'Примеры данных указаны',
  },
  {
    id: 'survey',
    label: 'Анкета',
    durationCheckbox: 'Ожидаемая длительность диалога указана',
  },
  { id: 'rating', label: 'Оценка', yesCheckbox: 'Критерии оценок ясны' },
  { id: 'agents', label: 'Агенты', noDetailsOnYes: true },
];

export const logicRows: ExpandableRowDef[] = [
  {
    id: 'faq',
    label: 'FAQ / Возражения',
    yesCheckboxes: [
      { id: 'scripts', label: 'Есть скрипты/материалы/готовые отработки' },
      { id: 'deviations', label: 'Возможность отклонения от формулировок указана' },
    ],
  },
  {
    id: 'topics',
    label: 'Специфичные тематики',
    yesNoOnly: true,
    yesCheckbox: 'Есть звонки/транскрибация',
  },
];

export const dataWorkSubItems: DataWorkSubItem[] = [
  {
    id: 'dataBefore',
    label: 'Данные ДО звонка',
    yesCheckbox: 'Нужна предобработка',
  },
  {
    id: 'dataAfter',
    label: 'Передача данных ПОСЛЕ звонка',
    yesPills: {
      label: 'Способ передачи',
      multiple: true,
      options: [
        { id: 'api', label: 'АПИ' },
        { id: 'textWhisper', label: 'Текстошёпот' },
        { id: 'audioWhisper', label: 'Аудиошёпот' },
      ],
    },
  },
  {
    id: 'dataDuring',
    label: 'Данные ВО ВРЕМЯ звонка',
    yesCheckbox: 'Все данные есть',
  },
];

export const sectionLayoutPairs: [string, string][] = [
  ['intro', 'metrics'],
  ['materials', 'voice'],
];

export const sections: Section[] = [
  {
    id: 'intro',
    number: 1,
    title: 'Вводные данные',
    fields: [
      {
        id: 'projectType',
        label: 'Тип проекта',
        type: 'pills',
        options: [
          { id: 'inbound', label: 'Входящий' },
          { id: 'outbound', label: 'Исходящий' },
        ],
      },
      {
        id: 'automationGoal',
        label: '',
        type: 'checkbox',
        checkboxLabel: 'Общая цель автоматизации',
      },
      {
        id: 'automationBoundaries',
        label: '',
        type: 'checkbox',
        checkboxLabel: 'Понятные границы автоматизации',
      },
      {
        id: 'lprDemo',
        label: 'ЛПР слушал демо?',
        type: 'pill-with-details',
        options: yesNoUnknown,
        requestOnUnknownOnly: true,
        detailsOnYes: [
          { id: 'lprFeedbackVoice', label: 'Есть ОС по озвучке' },
          { id: 'lprFeedbackLogic', label: 'Есть ОС по логике' },
        ],
      },
      {
        id: 'robotsExperience',
        label: 'Клиент работал с роботами?',
        type: 'pill-with-details',
        options: yesNoUnknown,
        requestOnUnknownOnly: true,
        detailsOnYes: [
          { id: 'robotsFeedback', label: 'Есть ОС: что нравилось/не нравилось' },
          { id: 'robotsProblems', label: 'Проблемы текущего робота описаны' },
        ],
        detailsOnNo: [
          { id: 'robotsConcerns', label: 'Переживания по поводу робота описаны' },
        ],
      },
      {
        id: 'workedWithClient',
        label: 'Работали с этим клиентом?',
        type: 'pill-with-details',
        options: yesNoUnknown,
        detailsOnYes: [{ id: 'clientPortrait', label: 'Портрет клиента' }],
      },
    ],
  },
  {
    id: 'outbound',
    number: 0,
    title: 'Специфика исходящих',
    conditional: 'outbound',
    fields: [{ id: 'outboundBlock', label: '', type: 'outbound' }],
  },
  {
    id: 'metrics',
    number: 2,
    title: 'Метрики и критерии',
    fields: [
      { id: 'desiredKpi', label: 'Желаемые KPI', type: 'pills', options: realisticOptions },
      { id: 'eeKpi', label: 'KPI для ЭЭ', type: 'pills', options: realisticOptions },
      { id: 'pilotCriteria', label: 'Критерии пилота', type: 'pills', options: realisticOptions },
      { id: 'uatCriteria', label: 'Критерии UAT', type: 'pills', options: realisticOptions },
    ],
  },
  {
    id: 'materials',
    number: 3,
    title: 'Материалы',
    fields: [
      {
        id: 'materialsBlock',
        label: '',
        type: 'materials',
        items: [
          {
            id: 'hasScheme',
            label: 'Схема',
            deviationCheckbox: 'Возможность отклонения от схемы указана',
          },
          {
            id: 'hasScript',
            label: 'Скрипт',
            deviationCheckbox: 'Возможность отклонения от скрипта указана',
          },
          { id: 'hasRecordings', label: 'Записи звонков' },
        ],
      },
    ],
  },
  {
    id: 'voice',
    number: 4,
    title: 'Озвучка и паузы',
    fields: [
      {
        id: 'voiceHumanity',
        label: 'Человечность озвучки',
        type: 'pill-with-details',
        options: yesNoUnknown,
        detailsOnYes: [
          { id: 'voiceHumanityConcept', label: 'Понятие «человечности» раскрыто' },
          {
            id: 'voiceHumanitySounds',
            label: 'Возможность использования междометий, фоновых звуков указана',
          },
        ],
      },
      {
        id: 'pauseRequirements',
        label: 'Требования к паузам',
        type: 'pill-with-details',
        options: yesNoUnknown,
        detailsOnYes: [
          {
            id: 'pauseSounds',
            label: 'Возможность использования междометий, фоновых звуков указана',
          },
        ],
      },
    ],
  },
  {
    id: 'modules',
    number: 5,
    title: 'Модули сценария (данные)',
    fields: [
      {
        id: 'modulesTable',
        label: '',
        type: 'usage-table',
        keyPrefix: 'module',
        rows: moduleRows,
        groups: moduleGroups,
      },
    ],
  },
  {
    id: 'logic',
    number: 6,
    title: 'Логика, FAQ, интеграции',
    fields: [
      {
        id: 'logicTable',
        label: '',
        type: 'usage-table',
        keyPrefix: 'logic',
        rows: logicRows,
      },
      {
        id: 'dataWork',
        label: 'Работа с данными',
        type: 'data-work',
        subItems: dataWorkSubItems,
        outboundCheckbox: 'Информация передаваемая с номером телефона указана',
      },
    ],
  },
  {
    id: 'analytics',
    number: 7,
    title: 'Аналитика',
    fields: [
      {
        id: 'analyticsFormat',
        label: 'Формат аналитики',
        type: 'pills',
        multiple: true,
        options: [
          { id: 'tiles', label: 'Плитки' },
          { id: 'filters', label: 'Фильтры' },
          { id: 'customColumns', label: 'Кастомные столбцы' },
        ],
      },
    ],
  },
];

export const moduleUsageOptions = yesNoUnknown;
export const logicUsageOptions = yesNoUnknown;
export const yesNoOptions = yesNo;
export const existsOptionsExport = existsOptions;

export const moduleModeOptions = [
  { id: 'accept', label: 'Принимаем' },
  { id: 'verify', label: 'Верифицируем' },
  { id: 'send', label: 'Отправляем' },
];

export const callbackTypeOptions = [
  { id: 'standard', label: 'Стандартные перезвоны' },
  { id: 'custom', label: 'Кастомная логика' },
];

export const launchOptions = [
  { id: 'table', label: 'Запуск по таблице' },
  { id: 'api', label: 'Запуск по API' },
];
