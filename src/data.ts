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

const existsYesNo = [
  { id: 'yes', label: 'Есть' },
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
  {
    title: 'FAQ и тематики',
    rowIds: ['faq', 'topics'],
  },
];

export const moduleRows: ExpandableRowDef[] = [
  { id: 'fio', label: 'ФИО', workWithLabel: 'ФИО', standardDetails: true },
  { id: 'region', label: 'Регион', workWithLabel: 'регионом', standardDetails: true },
  { id: 'city', label: 'Город', workWithLabel: 'городом', standardDetails: true },
  { id: 'address', label: 'Адрес', workWithLabel: 'адресом', standardDetails: true },
  { id: 'phone', label: 'Телефон', workWithLabel: 'телефоном', standardDetails: true },
  { id: 'email', label: 'E-mail', workWithLabel: 'e-mail', standardDetails: true },
  {
    id: 'time',
    label: 'Время / Интервал / Дата',
    workWithLabel: 'временем, интервалом и датой',
    standardDetails: true,
    hasSlotsFlow: true,
  },
  {
    id: 'product',
    label: 'Услуга / Товар',
    workWithLabel: 'услугой или товаром',
    standardDetails: true,
    examplesCheckbox: 'Примеры данных указаны',
  },
  {
    id: 'order',
    label: 'Номер заказа / накладной / договора',
    workWithLabel: 'номером заказа, накладной или договора',
    standardDetails: true,
    examplesCheckbox: 'Примеры данных указаны',
  },
  {
    id: 'survey',
    label: 'Анкета',
    workWithLabel: 'анкетой',
    durationCheckbox: 'Ожидаемая длительность диалога указана',
  },
  {
    id: 'rating',
    label: 'Оценка',
    workWithLabel: 'оценкой',
    yesCheckbox: 'Критерии оценок ясны',
  },
  {
    id: 'agents',
    label: 'Агенты',
    workWithLabel: 'агентами',
    yesCheckbox: 'Наша ЭЭ учтена',
  },
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
  },
];

export const dataWorkSubItems: DataWorkSubItem[] = [
  {
    id: 'dataBefore',
    label: 'Данные на обзвон',
    outboundOnly: true,
    hasUsedPills: true,
    method: {
      label: 'Способ получения',
      options: [
        { id: 'table', label: 'Таблица' },
        { id: 'api', label: 'API' },
      ],
      apiOptionId: 'api',
    },
    examplesCheckbox: 'Есть примеры реальных данных',
    docsCheckbox: 'Есть документация',
  },
  {
    id: 'dataDuring',
    label: 'Данные во время звонка',
    method: {
      label: 'Тип источника данных',
      options: [
        { id: 'api', label: 'Динамический (API)' },
        { id: 'static', label: 'Статические данные (предзагруженные таблицы)' },
      ],
      apiOptionId: 'api',
    },
    examplesCheckbox: 'Есть примеры реальных данных',
    docsCheckbox: 'Есть документация',
  },
  {
    id: 'dataAfter',
    label: 'Отправка данных после звонка',
    method: {
      options: [
        { id: 'api', label: 'API' },
        { id: 'callsTable', label: 'Таблица звонков' },
      ],
    },
  },
];

export const sectionLayoutPairs: [string, string][] = [
  ['intro', 'metrics'],
  ['materials', 'voice'],
  ['logic', 'operator'],
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
      {
        id: 'productLimitsNone',
        label: '',
        type: 'checkbox',
        checkboxLabel: 'Ограничения со стороны продукта отсутствуют',
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
      {
        id: 'interruption',
        label: 'Перебивание',
        type: 'pill-with-details',
        options: yesNoUnknown,
        detailsOnYes: [{ id: 'interruptionFormat', label: 'Формат перебивания указан' }],
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
    title: 'Интеграции',
    fields: [
      {
        id: 'dataWork',
        label: 'Получение/отправка данных',
        type: 'data-work',
        subItems: dataWorkSubItems,
      },
    ],
  },
  {
    id: 'operator',
    number: 7,
    title: 'Перевод на оператора',
    fields: [
      {
        id: 'operatorTransfer',
        label: 'Перевод на оператора',
        type: 'operator-transfer',
      },
    ],
  },
  {
    id: 'analytics',
    number: 8,
    title: 'Аналитика',
    fields: [
      {
        id: 'analyticsBlock',
        label: '',
        type: 'analytics',
        formatOptions: [
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
export const existsYesNoOptions = existsYesNo;
export const existsOptionsExport = existsOptions;

export const moduleModeOptions = [
  { id: 'accept', label: 'Принимаем' },
  { id: 'verify', label: 'Верифицируем / Озвучиваем' },
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
