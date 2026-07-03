import { dataWorkSubItems, logicRows, moduleRows } from './data';
import type { ExpandableRowDef, FormValues, RequestGroup } from './types';
import {
  getRowUsed,
  isOutbound,
  logicKey,
  needsRequestForPill,
  needsRequestForUnknownOnly,
  rowKey,
} from './utils';

function push(
  groups: Map<string, RequestGroup>,
  category: string,
  id: string,
  text: string,
  scrollTarget?: string,
) {
  if (!groups.has(category)) {
    groups.set(category, {
      id: category.toLowerCase().replace(/\s+/g, '-'),
      title: category.toUpperCase(),
      items: [],
    });
  }
  const group = groups.get(category)!;
  if (!group.items.some((item) => item.id === id)) {
    group.items.push({ id, text, scrollTarget });
  }
}

function collectRowRequests(
  groups: Map<string, RequestGroup>,
  category: string,
  prefix: 'module' | 'logic',
  rows: ExpandableRowDef[],
  values: FormValues,
) {
  for (const row of rows) {
    const usedKey = rowKey(prefix, row.id, 'used');
    const used = getRowUsed(values, prefix, row.id);
    if (!used || used === 'unknown') {
      push(
        groups,
        category,
        `${prefix}-${row.id}`,
        `Уточнить: используется ли «${row.label}»?`,
        usedKey,
      );
      continue;
    }
    if (used === 'no') continue;

    if (row.standardDetails) {
      const modeKey = rowKey(prefix, row.id, 'mode');
      const mode = values[modeKey];
      if (!Array.isArray(mode) || mode.length === 0) {
        push(
          groups,
          category,
          `${prefix}-${row.id}-mode`,
          `Уточнить: режим работы «${row.label}» (принимаем / верифицируем / отправляем)`,
          modeKey,
        );
      }
    }

    if (row.examplesCheckbox && values[rowKey(prefix, row.id, 'examples')] !== true) {
      push(
        groups,
        category,
        `${prefix}-${row.id}-examples`,
        `Запросить: примеры данных для поля «${row.label}»`,
        rowKey(prefix, row.id, 'examples'),
      );
    }

    if (row.durationCheckbox && values[rowKey(prefix, row.id, 'flag')] !== true) {
      push(
        groups,
        category,
        `${prefix}-${row.id}-duration`,
        `Уточнить: ${row.durationCheckbox.toLowerCase()} («${row.label}»)`,
        rowKey(prefix, row.id, 'flag'),
      );
    }

    if (row.yesCheckbox && values[rowKey(prefix, row.id, 'flag')] !== true) {
      push(
        groups,
        category,
        `${prefix}-${row.id}-flag`,
        `Уточнить: ${row.yesCheckbox.toLowerCase()} («${row.label}»)`,
        rowKey(prefix, row.id, 'flag'),
      );
    }

    if (row.yesCheckboxes) {
      for (const item of row.yesCheckboxes) {
        if (values[rowKey(prefix, row.id, item.id)] !== true) {
          push(
            groups,
            category,
            `${prefix}-${row.id}-${item.id}`,
            `Уточнить: ${item.label.toLowerCase()} («${row.label}»)`,
            rowKey(prefix, row.id, item.id),
          );
        }
      }
    }

    if (row.yesPills) {
      const pillsKey = rowKey(prefix, row.id, 'pills');
      const pills = values[pillsKey];
      if (!Array.isArray(pills) || pills.length === 0) {
        push(
          groups,
          category,
          `${prefix}-${row.id}-pills`,
          `Уточнить: способ передачи данных после звонка (АПИ / шёпот)`,
          pillsKey,
        );
      }
    }

    if (row.hasSlotsFlow) {
      const slotsKey = rowKey(prefix, row.id, 'slots');
      const slots = values[slotsKey];
      if (!slots || slots === 'unknown') {
        push(groups, category, `${prefix}-${row.id}-slots`, `Уточнить: используются ли слоты?`, slotsKey);
      } else if (slots === 'yes') {
        const useAgentKey = rowKey(prefix, row.id, 'useAgent');
        const useAgent = values[useAgentKey];
        if (!useAgent || useAgent === 'unknown') {
          push(
            groups,
            category,
            `${prefix}-${row.id}-agent`,
            `Уточнить: будет ли использоваться агент?`,
            useAgentKey,
          );
        }
      }
    }
  }
}

function collectDataWorkRequests(groups: Map<string, RequestGroup>, values: FormValues) {
  const usedKey = 'logic_dataWork_used';
  const used = values[usedKey];
  if (!used || used === 'unknown') {
    push(groups, 'Логика', 'dataWork', 'Уточнить: используется ли работа с данными?', usedKey);
    return;
  }
  if (used === 'no') return;

  for (const item of dataWorkSubItems) {
    if (item.yesCheckbox && values[logicKey(item.id, 'flag')] !== true) {
      push(
        groups,
        'Логика',
        `dataWork-${item.id}-flag`,
        `Уточнить: ${item.yesCheckbox.toLowerCase()} («${item.label}»)`,
        logicKey(item.id, 'flag'),
      );
    }
    if (item.yesPills) {
      const pillsKey = logicKey(item.id, 'pills');
      const pills = values[pillsKey];
      if (!Array.isArray(pills) || pills.length === 0) {
        push(
          groups,
          'Логика',
          `dataWork-${item.id}-pills`,
          `Уточнить: способ передачи данных после звонка (АПИ / шёпот)`,
          pillsKey,
        );
      }
    }
  }

  if (isOutbound(values) && values.logic_dataWork_phoneInfo !== true) {
    push(
      groups,
      'Логика',
      'dataWork-phoneInfo',
      'Уточнить: информация передаваемая с номером телефона',
      'logic_dataWork_phoneInfo',
    );
  }
}

export function generateRequests(values: FormValues): RequestGroup[] {
  const groups = new Map<string, RequestGroup>();

  if (needsRequestForPill(values.projectType)) {
    push(groups, 'Вводные', 'projectType', 'Уточнить: тип проекта — входящий или исходящий?', 'projectType');
  }
  if (values.automationGoal !== true) {
    push(groups, 'Вводные', 'automationGoal', 'Запросить: общая цель автоматизации', 'automationGoal');
  }
  if (values.automationBoundaries !== true) {
    push(
      groups,
      'Вводные',
      'automationBoundaries',
      'Уточнить: понятные границы автоматизации',
      'automationBoundaries',
    );
  }

  if (needsRequestForUnknownOnly(values.lprDemo)) {
    push(groups, 'Вводные', 'lprDemo', 'Уточнить: слушал ли ЛПР демо?', 'lprDemo');
  } else if (values.lprDemo === 'yes') {
    if (values.lprFeedbackVoice !== true) {
      push(groups, 'Вводные', 'lprFeedbackVoice', 'Запросить: обратную связь ЛПР по озвучке', 'lprFeedbackVoice');
    }
    if (values.lprFeedbackLogic !== true) {
      push(groups, 'Вводные', 'lprFeedbackLogic', 'Запросить: обратную связь ЛПР по логике', 'lprFeedbackLogic');
    }
  }

  if (needsRequestForUnknownOnly(values.robotsExperience)) {
    push(
      groups,
      'Вводные',
      'robotsExperience',
      'Уточнить: работал ли клиент с роботами ранее?',
      'robotsExperience',
    );
  } else if (values.robotsExperience === 'yes') {
    if (values.robotsFeedback !== true) {
      push(
        groups,
        'Вводные',
        'robotsFeedback',
        'Запросить: ОС клиента — что нравилось/не нравилось в роботах',
        'robotsFeedback',
      );
    }
    if (values.robotsProblems !== true) {
      push(groups, 'Вводные', 'robotsProblems', 'Уточнить: проблемы текущего робота', 'robotsProblems');
    }
  } else if (values.robotsExperience === 'no' && values.robotsConcerns !== true) {
    push(
      groups,
      'Вводные',
      'robotsConcerns',
      'Уточнить: переживания клиента по поводу робота',
      'robotsConcerns',
    );
  }

  if (needsRequestForPill(values.workedWithClient)) {
    push(
      groups,
      'Вводные',
      'workedWithClient',
      'Уточнить: работали ли с этим клиентом ранее?',
      'workedWithClient',
    );
  } else if (values.workedWithClient === 'yes' && values.clientPortrait !== true) {
    push(groups, 'Вводные', 'clientPortrait', 'Запросить: портрет клиента', 'clientPortrait');
  }

  if (isOutbound(values)) {
    const timeUsed = values.outboundTimeUsed;
    if (!timeUsed || timeUsed === 'unknown') {
      push(groups, 'Исходящие', 'outboundTime', 'Уточнить: ограничения по времени звонков', 'outboundTimeUsed');
    } else if (timeUsed === 'yes' && values.outboundTimeLogic !== true) {
      push(
        groups,
        'Исходящие',
        'outboundTimeLogic',
        'Уточнить: логику ограничения по времени звонков',
        'outboundTimeLogic',
      );
    }

    const callbackUsed = values.outboundCallbackUsed;
    if (!callbackUsed || callbackUsed === 'unknown') {
      push(groups, 'Исходящие', 'outboundCallback', 'Уточнить: логику перезвонов', 'outboundCallbackUsed');
    } else if (callbackUsed === 'yes' && !values.outboundCallbackType) {
      push(
        groups,
        'Исходящие',
        'outboundCallbackType',
        'Уточнить: тип логики перезвонов (стандартные / кастомная)',
        'outboundCallbackType',
      );
    }

    if (!values.outboundLaunch || values.outboundLaunch === '') {
      push(
        groups,
        'Исходящие',
        'outboundLaunch',
        'Уточнить: способ запуска — по таблице или по API',
        'outboundLaunch',
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
      push(groups, 'Метрики', field.id, field.text, field.id);
    }
  }

  const materialItems = [
    { id: 'hasScheme', label: 'схема', deviationId: 'hasSchemeDeviation' },
    { id: 'hasScript', label: 'скрипт', deviationId: 'hasScriptDeviation' },
    { id: 'hasRecordings', label: 'записи/транскрибации звонков' },
  ];
  for (const item of materialItems) {
    const v = values[item.id];
    if (!v || v === 'unknown') {
      push(groups, 'Материалы', item.id, `Запросить: ${item.label}`, item.id);
    } else if (v === 'yes' && item.deviationId && values[item.deviationId] !== true) {
      push(
        groups,
        'Материалы',
        item.deviationId,
        `Уточнить: возможность отклонения от ${item.label === 'скрипт' ? 'скрипта' : 'схемы'}`,
        item.deviationId,
      );
    }
  }

  if (needsRequestForPill(values.voiceHumanity)) {
    push(groups, 'Озвучка', 'voiceHumanity', 'Уточнить: требования к человечности озвучки', 'voiceHumanity');
  } else if (values.voiceHumanity === 'yes') {
    if (values.voiceHumanityConcept !== true) {
      push(
        groups,
        'Озвучка',
        'voiceHumanityConcept',
        'Уточнить: понятие «человечности» озвучки',
        'voiceHumanityConcept',
      );
    }
    if (values.voiceHumanitySounds !== true) {
      push(
        groups,
        'Озвучка',
        'voiceHumanitySounds',
        'Уточнить: возможность использования междометий и фоновых звуков',
        'voiceHumanitySounds',
      );
    }
  }

  if (needsRequestForPill(values.pauseRequirements)) {
    push(groups, 'Озвучка', 'pauseRequirements', 'Уточнить: требования к паузам', 'pauseRequirements');
  } else if (values.pauseRequirements === 'yes' && values.pauseSounds !== true) {
    push(
      groups,
      'Озвучка',
      'pauseSounds',
      'Уточнить: возможность использования междометий и фоновых звуков в паузах',
      'pauseSounds',
    );
  }

  collectRowRequests(groups, 'Данные', 'module', moduleRows, values);
  collectRowRequests(groups, 'Логика', 'logic', logicRows, values);
  collectDataWorkRequests(groups, values);

  const analytics = values.analyticsFormat;
  if (!Array.isArray(analytics) || analytics.length === 0) {
    push(
      groups,
      'Аналитика',
      'analyticsFormat',
      'Уточнить: требования к аналитике (плитки / фильтры / кастомные столбцы)',
      'analyticsFormat',
    );
  }

  const order = [
    'Вводные',
    'Исходящие',
    'Метрики',
    'Материалы',
    'Озвучка',
    'Данные',
    'Логика',
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
