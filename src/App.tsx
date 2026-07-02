import { useMemo, useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { SectionCard } from './components/SectionCard';
import { SectionNav } from './components/SectionNav';
import { Sidebar } from './components/Sidebar';
import { buildExportList, generateRequests } from './requests';
import type { FormValues } from './types';
import { clearModuleDetails, getVisibleSections, togglePill } from './utils';

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function App() {
  const [values, setValues] = useState<FormValues>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [exportCopied, setExportCopied] = useState(false);

  const visibleSections = useMemo(() => getVisibleSections(values), [values]);
  const requestGroups = useMemo(() => generateRequests(values), [values]);
  const requestCount = requestGroups.reduce((sum, g) => sum + g.items.length, 0);

  const handlePillChange = (fieldId: string, optionId: string, multiple?: boolean) => {
    setValues((prev) => {
      let next = togglePill(fieldId, optionId, multiple, prev);
      const usedMatch = fieldId.match(/^module_(.+)_used$/);
      if (usedMatch && next[fieldId] !== 'yes') {
        next = clearModuleDetails(next, usedMatch[1]);
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
    setValues({});
    setActiveSection(null);
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
            {visibleSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                values={values}
                onPillChange={handlePillChange}
                onCheckboxChange={handleCheckboxChange}
                onTextChange={handleTextChange}
              />
            ))}
          </main>
        </div>

        <Sidebar values={values} />
      </div>
    </div>
  );
}

export default App;
