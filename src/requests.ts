import { moduleRows } from './data';
import type { FormValues, RequestGroup } from './types';
import { getModuleUsed, isOutbound, needsRequestForPill } from './utils';

function push(groups: Map<string, RequestGroup>, category: string, id: string, text: string) {
  if (!groups.has(category)) {
    groups.set(category, {
      id: category.toLowerCase().replace(/\s+/g, '-'),
      title: category.toUpperCase(),
      items: [],
    });
  }
  const group = groups.get(category)!;
  if (!group.items.some((item) => item.id === id)) {
    group.items.push({ id, text });
  }
}

export function generateRequests(values: FormValues): RequestGroup[] {
  const groups = new Map<string, RequestGroup>();

  if (needsRequestForPill(values.projectType)) {
    push(groups, 'Вводные', 'projectType', 'Уточнить: тип проекта — входящий или исходящий?');
  }
  if (needsRequestForPill(values.automationGoal)) {
    push(groups, 'Вводные', 'automationGoal', 'Запросить: общая цель автоматизации');
  }
  if (needsRequestForPill(values.lprDemo)) {
    push(groups, 'Вводные', 'lprDemo', 'Уточнить: слушал ли ЛПР демо?');
  }
  if (needsRequestForPill(values.robotsExperience)) {
    push(
      groups,
      'Вводные',
      'robotsExperience',
      'Уточнить: работал ли клиент с роботами ранее?',
    );
  }

  if (isOutbound(values)) {
    if (values.outboundTimeRestrictions !== true) {
      push(
        groups,
        'Исходящие',
        'outboundTime',
        'Уточнить: ограничения по времени звонков',
      );
    }
    if (values.outboundCallbackLogic !== true) {
      push(groups, 'Исходящие', 'outboundCallback', 'Уточнить: логику перезвонов');
    }
    if (!values.outboundLaunch || values.outboundLaunch === '') {
      push(
        groups,
        'Исходящие',
        'outboundLaunch',
        'Уточнить: способ запуска — по таблице или по API',
      );
    }
  }

  const metricFields = [
    { id: 'desiredKpi', text: 'Уточнить у ЛПР: какие KPI считаются реалистичными?' },
    { id: 'eeKpi', text: 'Запросить: KPI для ЭЭ (экспертной эксплуатации)' },
    { id: 'pilotCriteria', text: 'Уточнить: критерии успешности пилота' },
    { id: 'uatCriteria', text: 'Уточнить: критерии приёмки (UAT)' },
  ];
  for (const field of metricFields) {
    if (needsRequestForPill(values[field.id], true)) {
      push(groups, 'Метрики', field.id, field.text);
    }
  }

  if (values.hasScheme !== true) {
    push(groups, 'Материалы', 'hasScheme', 'Запросить: схема сценария');
  }
  if (values.hasScript !== true) {
    push(groups, 'Материалы', 'hasScript', 'Запросить: скрипт диалога');
  }
  if (values.hasRecordings !== true) {
    push(
      groups,
      'Материалы',
      'hasRecordings',
      'Запросить: записи/транскрибации звонков',
    );
  }

  if (needsRequestForPill(values.voiceHumanity, false, true)) {
    push(
      groups,
      'Озвучка',
      'voiceHumanity',
      'Уточнить: требования к человечности озвучки',
    );
  }
  if (needsRequestForPill(values.pauseRequirements, false, true)) {
    push(groups, 'Озвучка', 'pauseRequirements', 'Уточнить: требования к паузам');
  }

  for (const row of moduleRows) {
    const used = getModuleUsed(values, row.id);
    if (!used) {
      push(
        groups,
        'Данные',
        `module-${row.id}`,
        `Уточнить: используется ли модуль «${row.label}»?`,
      );
    } else if (used === 'unknown') {
      push(
        groups,
        'Данные',
        `module-${row.id}-unknown`,
        `Уточнить: используется ли модуль «${row.label}»?`,
      );
    } else if (used === 'yes') {
      const mode = values[`module_${row.id}_mode`];
      if (!mode || typeof mode !== 'string') {
        push(
          groups,
          'Данные',
          `module-${row.id}-mode`,
          `Уточнить: режим работы модуля «${row.label}» (принимаем / верифицируем / отправляем)`,
        );
      }
      if (row.hasExamples) {
        const examples = values[`module_${row.id}_examples`];
        if (!examples || (typeof examples === 'string' && examples.trim() === '')) {
          push(
            groups,
            'Данные',
            `module-${row.id}-examples`,
            `Запросить: примеры данных для поля «${row.label}»`,
          );
        }
      }
    }
  }

  if (values.faqScripts !== true) {
    push(groups, 'Логика', 'faqScripts', 'Запросить: список FAQ и возражений');
  }
  if (values.faqDeviations !== true) {
    push(
      groups,
      'Логика',
      'faqDeviations',
      'Уточнить: есть ли возможность отклонения от скрипта?',
    );
  }
  const dataAfter = values.dataAfter;
  if (!Array.isArray(dataAfter) || dataAfter.length === 0) {
    push(
      groups,
      'Логика',
      'dataAfter',
      'Уточнить: способ передачи данных после звонка (АПИ / шёпот)',
    );
  }
  if (values.dataDuring !== true) {
    push(
      groups,
      'Логика',
      'dataDuring',
      'Запросить: документацию API или подтверждение наличия всех данных во время звонка',
    );
  }

  const analytics = values.analyticsFormat;
  if (!Array.isArray(analytics) || analytics.length === 0) {
    push(
      groups,
      'Аналитика',
      'analyticsFormat',
      'Уточнить: требования к аналитике (таблица / плитки / фильтры)',
    );
  }

  const order = [
    'Материалы',
    'Метрики',
    'Данные',
    'Логика',
    'Вводные',
    'Озвучка',
    'Исходящие',
    'Аналитика',
  ];

  return order
    .map((title) => groups.get(title))
    .filter((group): group is RequestGroup => Boolean(group));
}

export function buildEmailFromRequests(groups: RequestGroup[]): string {
  const lines = [
    'Добрый день!',
    '',
    'Для подготовки проекта автоматизации просим уточнить и предоставить следующее:',
    '',
  ];

  let index = 1;
  for (const group of groups) {
    for (const item of group.items) {
      lines.push(`${index}. ${item.text}`);
      index += 1;
    }
  }

  lines.push('', 'Спасибо!');
  return lines.join('\n');
}

export function buildExportList(groups: RequestGroup[]): string {
  return groups.flatMap((g) => g.items.map((i) => i.text)).join('\n');
}
