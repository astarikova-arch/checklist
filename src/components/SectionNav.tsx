import type { FormValues, Section } from '../types';
import { getSectionProgress, getStatusEmoji } from '../utils';

type SectionNavProps = {
  sections: Section[];
  values: FormValues;
  activeId: string | null;
  onNavigate: (sectionId: string) => void;
};

export function SectionNav({ sections, values, activeId, onNavigate }: SectionNavProps) {
  return (
    <div className="section-nav-wrap">
      <div className="section-nav-legend" aria-label="Легенда статусов">
        <span>🟢 готово</span>
        <span>🟡 частично</span>
        <span>🔴 пусто</span>
      </div>
      <nav className="section-nav" aria-label="Навигация по секциям">
        {sections.map((section) => {
          const { status } = getSectionProgress(section, values);
          const label =
            section.number > 0
              ? `${section.number}. ${section.title}`
              : section.title;

          return (
            <button
              key={section.id}
              type="button"
              className={`section-nav-chip ${activeId === section.id ? 'section-nav-chip--active' : ''}`}
              onClick={() => onNavigate(section.id)}
              title={label}
            >
              <span className="section-nav-emoji" aria-hidden>
                {getStatusEmoji(status)}
              </span>
              <span className="section-nav-label">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
