import type { ModuleRowDef, Section } from './types';

const yesNoUnknown = [
  { id: 'yes', label: 'Да' },
  { id: 'no', label: 'Нет' },
  { id: 'unknown', label: 'Неизвестно' },
];

const realisticOptions = [
  { id: 'realistic', label: 'Реалистичны' },
  { id: 'unrealistic', label: 'Нереалистичны' },
  { id: 'unknown', label: 'Неизвестно' },
];

const statedOptions = [
  { id: 'stated', label: 'Указано' },
  { id: 'missing', label: 'Нет данных' },
];

export const moduleRows: ModuleRowDef[] = [
  { id: 'fio', label: 'ФИО' },
  { id: 'region', label: 'Регион' },
  { id: 'city', label: 'Город' },
  { id: 'address', label: 'Адрес' },
  { id: 'phone', label: 'Телефон' },
  { id: 'email', label: 'E-mail' },
  { id: 'time', label: 'Время / Интервал', hasTimeExtras: true },
  { id: 'date', label: 'Дата' },
  { id: 'product', label: 'Услуга / Товар', hasExamples: true },
  { id: 'order', label: 'Номер заказа', hasExamples: true },
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
        label: 'Общая цель автоматизации',
        type: 'pills',
        options: yesNoUnknown,
      },
      {
        id: 'lprDemo',
        label: 'ЛПР слушал демо?',
        type: 'pills',
        options: yesNoUnknown,
      },
      {
        id: 'robotsExperience',
        label: 'Клиент работал с роботами?',
        type: 'pills',
        options: yesNoUnknown,
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
      {
        id: 'desiredKpi',
        label: 'Желаемые KPI',
        type: 'pills',
        options: realisticOptions,
      },
      {
        id: 'eeKpi',
        label: 'KPI для ЭЭ',
        type: 'pills',
        options: realisticOptions,
      },
      {
        id: 'pilotCriteria',
        label: 'Критерии пилота',
        type: 'pills',
        options: realisticOptions,
      },
      {
        id: 'uatCriteria',
        label: 'Критерии UAT',
        type: 'pills',
        options: realisticOptions,
      },
    ],
  },
  {
    id: 'materials',
    number: 3,
    title: 'Материалы',
    fields: [
      {
        id: 'hasScheme',
        label: 'Схема',
        type: 'checkbox',
        checkboxLabel: 'Есть схема',
      },
      {
        id: 'hasScript',
        label: 'Скрипт',
        type: 'checkbox',
        checkboxLabel: 'Есть скрипт',
      },
      {
        id: 'hasRecordings',
        label: 'Записи звонков',
        type: 'checkbox',
        checkboxLabel: 'Есть записи / транскрибации звонков',
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
        type: 'pills',
        options: statedOptions,
      },
      {
        id: 'pauseRequirements',
        label: 'Требования к паузам',
        type: 'pills',
        options: statedOptions,
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
        type: 'modules-table',
        rows: moduleRows,
      },
    ],
  },
  {
    id: 'logic',
    number: 6,
    title: 'Логика, FAQ, интеграции',
    fields: [
      {
        id: 'faq',
        label: 'FAQ / Возражения',
        type: 'checkbox-group',
        items: [
          { id: 'faqScripts', label: 'Есть скрипты/материалы/готовые отработки' },
          { id: 'faqDeviations', label: 'Возможны отклонения от формулировок' },
        ],
      },
      {
        id: 'topics',
        label: 'Специфичные тематики',
        type: 'pills',
        multiple: true,
        options: [
          { id: 'calls', label: 'Звонки' },
          { id: 'transcription', label: 'Транскрибация' },
        ],
      },
      {
        id: 'dataBefore',
        label: 'Данные ДО звонка',
        type: 'checkbox',
        checkboxLabel: 'Нужна предобработка',
      },
      {
        id: 'dataAfter',
        label: 'Передача данных ПОСЛЕ звонка',
        type: 'pills',
        multiple: true,
        options: [
          { id: 'api', label: 'АПИ' },
          { id: 'textWhisper', label: 'Текстошёпот' },
          { id: 'audioWhisper', label: 'Аудиошёпот' },
        ],
      },
      {
        id: 'dataDuring',
        label: 'Данные ВО ВРЕМЯ звонка',
        type: 'checkbox',
        checkboxLabel: 'Все данные есть',
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
          { id: 'table', label: 'Таблица' },
          { id: 'tiles', label: 'Плитки' },
          { id: 'filters', label: 'Фильтры' },
          { id: 'customColumns', label: 'Кастомные столбцы' },
        ],
      },
    ],
  },
];

export const moduleUsageOptions = [
  { id: 'yes', label: 'Да' },
  { id: 'no', label: 'Нет' },
  { id: 'unknown', label: 'Неизвестно' },
];

export const moduleModeOptions = [
  { id: 'accept', label: 'Принимаем' },
  { id: 'verify', label: 'Верифицируем' },
  { id: 'send', label: 'Отправляем' },
];

export const launchOptions = [
  { id: 'table', label: 'Запуск по таблице' },
  { id: 'api', label: 'Запуск по API' },
];
