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

function moduleWorkForm(row: ExpandableRowDef): string {
  return row.workWithLabel ?? row.label.toLowerCase();
}

function moduleUsageQuestion(row: ExpandableRowDef): string {
  return `Должен ли робот работать с ${moduleWorkForm(row)}? Если да, то что именно робот должен делать?`;
}

function moduleModeQuestion(row: ExpandableRowDef): string {
  return `Что именно робот должен делать с ${moduleWorkForm(row)}?`;
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
      let text: string;
      if (prefix === 'module') {
        text = moduleUsageQuestion(row);
      } else if (row.id === 'faq') {
        text = 'Нужна ли в сценарии отработка FAQ и возражений?';
      } else if (row.id === 'topics') {
        text = 'Есть ли специфичные тематики, которые нужно учесть в сценарии?';
      } else {
        text = moduleUsageQuestion(row);
      }
      push(groups, category, `${prefix}-${row.id}`, text, usedKey);
      continue;
    }
    if (used === 'no') continue;

    if (row.standardDetails) {
      const modeKey = rowKey(prefix, row.id, 'mode');
      const mode = values[modeKey];
      if (!Array.isArray(mode) || mode.length === 0) {
        const text = prefix === 'module' ? moduleModeQuestion(row) : moduleModeQuestion(row);
        push(groups, category, `${prefix}-${row.id}-mode`, text, modeKey);
      }
    }

    if (row.examplesCheckbox && values[rowKey(prefix, row.id, 'examples')] !== true) {
      push(
        groups,
        category,
        `${prefix}-${row.id}-examples`,
        `Просим примеры данных для поля «${row.label}».`,
        rowKey(prefix, row.id, 'examples'),
      );
    }

    if (row.durationCheckbox && values[rowKey(prefix, row.id, 'flag')] !== true) {
      push(
        groups,
        category,
        `${prefix}-${row.id}-duration`,
        'Какая ожидаемая длительность диалога?',
        rowKey(prefix, row.id, 'flag'),
      );
    }

    if (row.id === 'rating' && row.yesCheckbox && values[rowKey(prefix, row.id, 'flag')] !== true) {
      push(
        groups,
        category,
        `${prefix}-${row.id}-flag`,
        'Есть ли чёткие критерии, по которым робот соотносит оценку от абонента с бальной системой?',
        rowKey(prefix, row.id, 'flag'),
      );
    } else if (
      row.id === 'agents' &&
      used === 'yes' &&
      values[rowKey(prefix, row.id, 'flag')] !== true
    ) {
      push(
        groups,
        'Внутренние',
        `${prefix}-${row.id}-ee`,
        'Можем ли использовать агентов в сценарии? Выгодно ли это нам?',
        rowKey(prefix, row.id, 'flag'),
      );
    } else if (row.yesCheckbox && row.id !== 'rating' && row.id !== 'agents' && values[rowKey(prefix, row.id, 'flag')] !== true) {
      push(
        groups,
        category,
        `${prefix}-${row.id}-flag`,
        row.yesCheckbox.endsWith('?') ? row.yesCheckbox : `${row.yesCheckbox}?`,
        rowKey(prefix, row.id, 'flag'),
      );
    }

    if (row.yesCheckboxes) {
      for (const item of row.yesCheckboxes) {
        if (values[rowKey(prefix, row.id, item.id)] !== true) {
          let text = item.label.endsWith('?') ? item.label : `${item.label}?`;
          if (row.id === 'faq' && item.id === 'scripts') {
            text =
              'Есть ли скрипты, материалы или готовые отработки для FAQ и возражений?';
          }
          if (row.id === 'faq' && item.id === 'deviations') {
            text = 'Допустимы ли отклонения от формулировок в FAQ и возражениях?';
          }
          push(
            groups,
            category,
            `${prefix}-${row.id}-${item.id}`,
            text,
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
          'Способ передачи данных, зафиксированных в звонке: запись в таблицу с выгрузкой из ЛК в Excel или передача по API?',
          pillsKey,
        );
      }
    }

    if (row.hasSlotsFlow) {
      const slotsKey = rowKey(prefix, row.id, 'slots');
      const slots = values[slotsKey];
      if (!slots || slots === 'unknown') {
        push(
          groups,
          category,
          `${prefix}-${row.id}-slots`,
          'Будут ли использоваться слоты (выбор времени/интервала)?',
          slotsKey,
        );
      } else if (slots === 'yes') {
        const useAgentKey = rowKey(prefix, row.id, 'useAgent');
        const useAgent = values[useAgentKey];
        if (!useAgent || useAgent === 'unknown') {
          push(
            groups,
            category,
            `${prefix}-${row.id}-agent`,
            'Допустимо ли использование агента для подбора слотов?',
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
    push(
      groups,
      'Логика',
      'dataWork',
      'Будет ли робот работать с данными до, во время и после звонка?',
      usedKey,
    );
    return;
  }
  if (used === 'no') return;

  for (const item of dataWorkSubItems) {
    if (item.yesCheckbox && values[logicKey(item.id, 'flag')] !== true) {
      const text =
        item.id === 'dataBefore'
          ? 'Нужна ли предобработка данных до звонка? Если да — какая?'
          : item.id === 'dataDuring'
            ? 'Все ли данные, необходимые во время звонка, будут доступны роботу?'
            : `${item.yesCheckbox}?`;
      push(groups, 'Логика', `dataWork-${item.id}-flag`, text, logicKey(item.id, 'flag'));
    }
    if (item.yesPills) {
      const pillsKey = logicKey(item.id, 'pills');
      const pills = values[pillsKey];
      if (!Array.isArray(pills) || pills.length === 0) {
        push(
          groups,
          'Логика',
          `dataWork-${item.id}-pills`,
          'Способ передачи данных, зафиксированных в звонке: запись в таблицу с выгрузкой из ЛК в Excel или передача по API?',
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
      'Будет ли робот получать информацию об абоненте вместе с номером телефона? Какую именно?',
      'logic_dataWork_phoneInfo',
    );
  }
}

export function generateRequests(values: FormValues): RequestGroup[] {
  const groups = new Map<string, RequestGroup>();

  if (needsRequestForPill(values.projectType)) {
    push(
      groups,
      'Вводные',
      'projectType',
      'Проект планируется входящим (принимаем звонки) или исходящим (обзвон)?',
      'projectType',
    );
  }
  if (values.automationGoal !== true) {
    push(
      groups,
      'Вводные',
      'automationGoal',
      'Какова общая цель автоматизации? Что робот должен сделать по итогам звонка?',
      'automationGoal',
    );
  }
  if (values.automationBoundaries !== true) {
    push(
      groups,
      'Вводные',
      'automationBoundaries',
      'Какие границы у автоматизации: что робот точно делает, а что — нет?',
      'automationBoundaries',
    );
  }

  if (needsRequestForUnknownOnly(values.lprDemo)) {
    push(groups, 'Вводные', 'lprDemo', 'Слушал ли ЛПР демо / примеры звонков?', 'lprDemo');
  } else if (values.lprDemo === 'yes') {
    if (values.lprFeedbackVoice !== true) {
      push(
        groups,
        'Вводные',
        'lprFeedbackVoice',
        'Есть ли обратная связь ЛПР по озвучке демосценария: что понравилось, что нет?',
        'lprFeedbackVoice',
      );
    }
    if (values.lprFeedbackLogic !== true) {
      push(
        groups,
        'Вводные',
        'lprFeedbackLogic',
        'Есть ли обратная связь ЛПР по логике демосценария?',
        'lprFeedbackLogic',
      );
    }
  }

  if (needsRequestForUnknownOnly(values.robotsExperience)) {
    push(
      groups,
      'Вводные',
      'robotsExperience',
      'Работал ли клиент с голосовыми роботами ранее?',
      'robotsExperience',
    );
  } else if (values.robotsExperience === 'yes') {
    if (values.robotsFeedback !== true) {
      push(
        groups,
        'Вводные',
        'robotsFeedback',
        'ОС клиента: что нравилось и не нравилось в предыдущем роботе?',
        'robotsFeedback',
      );
    }
    if (values.robotsProblems !== true) {
      push(
        groups,
        'Вводные',
        'robotsProblems',
        'С какими проблемами в работе робота сталкивались?',
        'robotsProblems',
      );
    }
  } else if (values.robotsExperience === 'no' && values.robotsConcerns !== true) {
    push(
      groups,
      'Вводные',
      'robotsConcerns',
      'Есть ли переживания или сомнения по поводу использования робота?',
      'robotsConcerns',
    );
  }

  if (needsRequestForPill(values.workedWithClient)) {
    push(
      groups,
      'Внутренние',
      'workedWithClient',
      'Работали ли мы с этим клиентом ранее? Есть ли особенности, которые стоит учесть?',
      'workedWithClient',
    );
  } else if (values.workedWithClient === 'yes' && values.clientPortrait !== true) {
    push(
      groups,
      'Внутренние',
      'clientPortrait',
      'Есть ли портрет клиента: насколько лоялен, что важно знать на основе прошлого опыта?',
      'clientPortrait',
    );
  }

  if (values.productLimitsNone !== true) {
    push(
      groups,
      'Внутренние',
      'productLimitsNone',
      'Функционал, запрашиваемый клиентом не реализован в продукте',
      'productLimitsNone',
    );
  }

  if (isOutbound(values)) {
    const timeUsed = values.outboundTimeUsed;
    if (!timeUsed || timeUsed === 'unknown') {
      push(groups, 'Исходящие', 'outboundTime', 'Будут ли ограничения по времени звонков?', 'outboundTimeUsed');
    } else if (timeUsed === 'yes' && values.outboundTimeLogic !== true) {
      push(
        groups,
        'Исходящие',
        'outboundTimeLogic',
        'Какая логика ограничений по времени звонков (окна, часовые пояса, праздники)?',
        'outboundTimeLogic',
      );
    }

    const callbackUsed = values.outboundCallbackUsed;
    if (!callbackUsed || callbackUsed === 'unknown' || (callbackUsed === 'yes' && !values.outboundCallbackType)) {
      push(
        groups,
        'Исходящие',
        'outboundCallback',
        'Какая ожидаемая логика перезвонов?',
        callbackUsed === 'yes' ? 'outboundCallbackType' : 'outboundCallbackUsed',
      );
    }

    if (!values.outboundLaunch || values.outboundLaunch === '') {
      push(
        groups,
        'Исходящие',
        'outboundLaunch',
        'Как будем запускать звонки: по таблице или по API?',
        'outboundLaunch',
      );
    }
  }

  const metricFields = [
    {
      id: 'desiredKpi',
      text: 'Какие ключевые показатели ожидаются?',
    },
    {
      id: 'eeKpi',
      text: 'Какие показатели нужны для экономической эффективности? Есть ли пожелания по цене и длительности диалога?',
    },
    {
      id: 'pilotCriteria',
      text: 'По каким критериям считаем пилот успешным?',
    },
    {
      id: 'uatCriteria',
      text: 'По каким критериям принимаем проект (UAT)?',
    },
  ];
  for (const field of metricFields) {
    if (needsRequestForPill(values[field.id], true)) {
      push(groups, 'Метрики', field.id, field.text, field.id);
    }
  }

  const materialItems = [
    { id: 'hasScheme', text: 'Просим предоставить схему сценария (блок-схему или описание ветвлений).' },
    { id: 'hasScript', text: 'Просим предоставить скрипт диалога / документ с формулировками.' },
    {
      id: 'hasRecordings',
      text: 'По возможности хотелось бы получить записи или транскрибации звонков (хотя бы 30–40 штук).',
    },
  ];
  for (const item of materialItems) {
    const v = values[item.id];
    if (!v || v === 'unknown') {
      push(groups, 'Материалы', item.id, item.text, item.id);
    }
  }

  const needsDeviation =
    (values.hasScheme === 'yes' && values.hasSchemeDeviation !== true) ||
    (values.hasScript === 'yes' && values.hasScriptDeviation !== true);
  if (needsDeviation) {
    push(
      groups,
      'Материалы',
      'materialsDeviation',
      'Допускается ли отклонение от схемы, можем ли предложить правки в скрипт?',
      'hasSchemeDeviation',
    );
  }

  if (needsRequestForPill(values.voiceHumanity)) {
    push(
      groups,
      'Озвучка',
      'voiceHumanity',
      'Есть ли требования к «человечности» озвучки?',
      'voiceHumanity',
    );
  } else if (values.voiceHumanity === 'yes') {
    if (values.voiceHumanityConcept !== true) {
      push(
        groups,
        'Озвучка',
        'voiceHumanityConcept',
        'Что для вас означает «человечная» озвучка? Можете описать на примерах?',
        'voiceHumanityConcept',
      );
    }
    if (values.voiceHumanitySounds !== true) {
      push(
        groups,
        'Озвучка',
        'voiceHumanitySounds',
        'Допустимо ли использование междометий и фоновых звуков (например, «ааа…», «ммм…», шум колл-центра, звуки клавиатуры) для достижения человечности озвучки?',
        'voiceHumanitySounds',
      );
    }
  }

  if (needsRequestForPill(values.pauseRequirements)) {
    push(groups, 'Озвучка', 'pauseRequirements', 'Есть ли требования к паузам в диалоге?', 'pauseRequirements');
  } else if (values.pauseRequirements === 'yes' && values.pauseSounds !== true) {
    push(
      groups,
      'Озвучка',
      'pauseSounds',
      'Допустимы ли междометия и фоновые звуки в паузах?',
      'pauseSounds',
    );
  }

  if (needsRequestForPill(values.interruption)) {
    push(
      groups,
      'Озвучка',
      'interruption',
      'Должен ли робот понимать, когда его перебивают?',
      'interruption',
    );
  } else if (values.interruption === 'yes' && values.interruptionFormat !== true) {
    push(
      groups,
      'Озвучка',
      'interruptionFormat',
      'Какое поведение после перебивания ожидается?',
      'interruptionFormat',
    );
  }

  collectRowRequests(groups, 'Данные', 'module', moduleRows, values);

  collectRowRequests(groups, 'Логика', 'logic', logicRows, values);
  collectDataWorkRequests(groups, values);

  if (needsRequestForPill(values.operatorTransfer)) {
    push(
      groups,
      'Логика',
      'operatorTransfer',
      'Нужен ли переход на оператора в сценарии?',
      'operatorTransfer',
    );
  } else if (values.operatorTransfer === 'yes') {
    const audioWhisper = values.operatorTransferAudioWhisper;
    if (typeof audioWhisper !== 'string' || !audioWhisper) {
      push(
        groups,
        'Логика',
        'operatorTransferAudioWhisper',
        'При переводе звонка на оператора, нужно ли передавать какую-то информацию из разговора абонента с роботом?',
        'operatorTransferAudioWhisper',
      );
    } else if (audioWhisper === 'yes' && values.operatorTransferData !== true) {
      push(
        groups,
        'Логика',
        'operatorTransferData',
        'Какие данные по звонку должны передаваться оператору?',
        'operatorTransferData',
      );
    }
  }

  const analyticsNeeded = values.analyticsNeeded;
  if (!analyticsNeeded || analyticsNeeded === 'unknown') {
    push(
      groups,
      'Аналитика',
      'analyticsNeeded',
      'Какую аналитику хотели бы видеть в личном кабинете?',
      'analyticsNeeded',
    );
  } else if (analyticsNeeded === 'yes') {
    const format = values.analyticsFormat;
    if (!Array.isArray(format) || format.length === 0) {
      push(
        groups,
        'Аналитика',
        'analyticsFormat',
        'Какой формат аналитики в личном кабинете нужен: плитки, фильтры, кастомные столбцы?',
        'analyticsFormat',
      );
    }
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
    'Внутренние',
  ];

  return order
    .map((title) => groups.get(title))
    .filter((group): group is RequestGroup => Boolean(group));
}

const INTERNAL_GROUP_TITLE = 'ВНУТРЕННИЕ';

export function isClientRequestGroup(group: RequestGroup): boolean {
  return group.title !== INTERNAL_GROUP_TITLE;
}

export function getClientRequestGroups(groups: RequestGroup[]): RequestGroup[] {
  return groups.filter(isClientRequestGroup);
}

export function countClientRequests(groups: RequestGroup[]): number {
  return getClientRequestGroups(groups).reduce((sum, group) => sum + group.items.length, 0);
}

export function buildEmailFromRequests(groups: RequestGroup[]): string {
  const clientGroups = getClientRequestGroups(groups);
  const lines = ['Для полноценной оценки проекта нужны следующие уточнения:', ''];

  let index = 1;
  for (const group of clientGroups) {
    lines.push(group.title.charAt(0) + group.title.slice(1).toLowerCase());
    for (const item of group.items) {
      lines.push(`${index}. ${item.text}`);
      index += 1;
    }
    lines.push('');
  }

  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
}
