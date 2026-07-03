import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { logicRows, moduleRows } from './data';
import { Header } from './components/Header';
import { SectionCard } from './components/SectionCard';
import { SectionNav } from './components/SectionNav';
import { Sidebar } from './components/Sidebar';
import { buildExportList, generateRequests } from './requests';
import { scrollToFormField } from './scroll';
import { clearFormValues, loadFormValues, saveFormValues } from './storage';
import type { FormValues } from './types';
import {
  clearDataWorkDetails,
  clearPillDetails,
  clearRowDetails,
  getVisibleSections,
  layoutSections,
  moduleKey,
  togglePill,
} from './utils';

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

const LPR_DETAIL_IDS = ['lprFeedbackVoice', 'lprFeedbackLogic'];
const ROBOTS_YES_IDS = ['robotsFeedback', 'robotsProblems'];
const ROBOTS_NO_IDS = ['robotsConcerns'];
const WORKED_WITH_CLIENT_IDS = ['clientPortrait'];
const VOICE_HUMANITY_IDS = ['voiceHumanityConcept', 'voiceHumanitySounds'];
const PAUSE_IDS = ['pauseSounds'];

function App() {
  const [values, setValues] = useState<FormValues>(() => loadFormValues());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [exportCopied, setExportCopied] = useState(false);
  const [agentsAutoSet, setAgentsAutoSet] = useState(false);
  const sectionObserver = useRef<IntersectionObserver | null>(null);

  const visibleSections = useMemo(() => getVisibleSections(values), [values]);
  const layoutItems = useMemo(() => layoutSections(visibleSections), [visibleSections]);
  const requestGroups = useMemo(() => generateRequests(values), [values]);
  const requestCount = requestGroups.reduce((sum, g) => sum + g.items.length, 0);

  useEffect(() => {
    saveFormValues(values);
  }, [values]);

  useEffect(() => {
    const sectionIds = visibleSections.map((s) => s.id);
    sectionObserver.current?.disconnect();

    sectionObserver.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top?.target.id.startsWith('section-')) {
          setActiveSection(top.target.id.replace('section-', ''));
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(`section-${id}`);
      if (el) sectionObserver.current.observe(el);
    }

    return () => sectionObserver.current?.disconnect();
  }, [visibleSections]);

  const handlePillChange = (fieldId: string, optionId: string, multiple?: boolean) => {
    setValues((prev) => {
      let next = togglePill(fieldId, optionId, multiple, prev);

      const moduleMatch = fieldId.match(/^module_(.+)_used$/);
      if (moduleMatch) {
        const row = moduleRows.find((r) => r.id === moduleMatch[1]);
        if (row && next[fieldId] !== 'yes') {
          next = clearRowDetails(next, 'module', row);
        }
        if (moduleMatch[1] === 'agents') {
          setAgentsAutoSet(false);
        }
      }

      const logicMatch = fieldId.match(/^logic_(.+)_used$/);
      if (logicMatch) {
        const row = logicRows.find((r) => r.id === logicMatch[1]);
        if (row && next[fieldId] !== 'yes') {
          next = clearRowDetails(next, 'logic', row);
        }
      }

      if (fieldId === 'logic_dataWork_used' && next.logic_dataWork_used !== 'yes') {
        next = clearDataWorkDetails(next);
      }

      if (fieldId === 'lprDemo' && next.lprDemo !== 'yes') {
        next = clearPillDetails(next, fieldId, LPR_DETAIL_IDS);
      }

      if (fieldId === 'robotsExperience') {
        if (next.robotsExperience !== 'yes') {
          next = clearPillDetails(next, fieldId, ROBOTS_YES_IDS);
        }
        if (next.robotsExperience !== 'no') {
          next = clearPillDetails(next, fieldId, ROBOTS_NO_IDS);
        }
      }

      if (fieldId === 'workedWithClient' && next.workedWithClient !== 'yes') {
        next = clearPillDetails(next, fieldId, WORKED_WITH_CLIENT_IDS);
      }

      if (fieldId === 'voiceHumanity' && next.voiceHumanity !== 'yes') {
        next = clearPillDetails(next, fieldId, VOICE_HUMANITY_IDS);
      }

      if (fieldId === 'pauseRequirements' && next.pauseRequirements !== 'yes') {
        next = clearPillDetails(next, fieldId, PAUSE_IDS);
      }

      if (fieldId === 'hasScheme' && next.hasScheme !== 'yes') {
        next = clearPillDetails(next, fieldId, ['hasSchemeDeviation']);
      }
      if (fieldId === 'hasScript' && next.hasScript !== 'yes') {
        next = clearPillDetails(next, fieldId, ['hasScriptDeviation']);
      }

      if (fieldId === 'outboundTimeUsed' && next.outboundTimeUsed !== 'yes') {
        next = clearPillDetails(next, fieldId, ['outboundTimeLogic']);
      }
      if (fieldId === 'outboundCallbackUsed' && next.outboundCallbackUsed !== 'yes') {
        delete next.outboundCallbackType;
      }

      const slotsKey = moduleKey('time', 'slots');
      if (fieldId === slotsKey && next[fieldId] !== 'yes') {
        delete next[moduleKey('time', 'useAgent')];
        setAgentsAutoSet(false);
      }

      const useAgentKey = moduleKey('time', 'useAgent');
      if (fieldId === useAgentKey) {
        if (next[useAgentKey] === 'yes') {
          next = { ...next, [moduleKey('agents', 'used')]: 'yes' };
          setAgentsAutoSet(true);
        } else {
          setAgentsAutoSet(false);
        }
      }

      return next;
    });
  };

  const handleCheckboxChange = (fieldId: string, checked: boolean) => {
    setValues((prev) => ({ ...prev, [fieldId]: checked }));
  };

  const handleTextChange = (fieldId: string, text: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: text }));
  };

  const handleReset = () => {
    if (!window.confirm('Сбросить все ответы? Сохранённые данные будут удалены.')) {
      return;
    }
    setValues({});
    setAgentsAutoSet(false);
    setActiveSection(null);
    clearFormValues();
  };

  const handleExport = async () => {
    await copyText(buildExportList(requestGroups));
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(`section-${sectionId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavigateToField = (scrollTarget: string) => {
    const sectionMap: Record<string, string> = {
      projectType: 'intro',
      automationGoal: 'intro',
      outboundTimeUsed: 'outbound',
      desiredKpi: 'metrics',
      hasScheme: 'materials',
      voiceHumanity: 'voice',
      module_fio_used: 'modules',
      logic_faq_used: 'logic',
      logic_dataWork_used: 'logic',
      analyticsFormat: 'analytics',
    };

    const prefix = scrollTarget.split('_')[0];
    const sectionId =
      sectionMap[scrollTarget] ??
      (prefix === 'module' ? 'modules' : prefix === 'logic' ? 'logic' : undefined);

    if (sectionId) {
      setActiveSection(sectionId);
    }

    window.setTimeout(() => scrollToFormField(scrollTarget), sectionId ? 120 : 0);
  };

  return (
    <div className="app">
      <Header
        values={values}
        requestCount={requestCount}
        onReset={handleReset}
        onExport={handleExport}
        exportCopied={exportCopied}
      />

      <div className="layout">
        <div className="checklist-column">
          <SectionNav
            sections={visibleSections}
            values={values}
            activeId={activeSection}
            onNavigate={handleNavigate}
          />

          <main className="main-column">
            {layoutItems.map((item) => {
              const renderCard = (section: (typeof visibleSections)[number]) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  values={values}
                  agentsAutoSet={agentsAutoSet}
                  inRow
                  onPillChange={handlePillChange}
                  onCheckboxChange={handleCheckboxChange}
                  onTextChange={handleTextChange}
                />
              );

              if (Array.isArray(item)) {
                return (
                  <div key={`row-${item[0].id}-${item[1].id}`} className="section-row">
                    {item.map(renderCard)}
                  </div>
                );
              }

              return renderCard(item);
            })}
          </main>
        </div>

        <Sidebar values={values} onNavigateToField={handleNavigateToField} />
      </div>
    </div>
  );
}

export default App;
