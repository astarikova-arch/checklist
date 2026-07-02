import type { FormValues, Section } from '../types';
import { getSectionProgress, getStatusEmoji } from '../utils';
import { FieldRenderer } from './FieldRenderer';

type SectionCardProps = {
  section: Section;
  values: FormValues;
  onPillChange: (fieldId: string, optionId: string, multiple?: boolean) => void;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
  onTextChange: (fieldId: string, text: string) => void;
};

export function SectionCard({
  section,
  values,
  onPillChange,
  onCheckboxChange,
  onTextChange,
}: SectionCardProps) {
  const { filled, total, status } = getSectionProgress(section, values);
  const displayNumber = section.number > 0 ? section.number : '⚡';

  return (
    <section className="section-card" id={`section-${section.id}`}>
      <header className="section-header">
        <div className="section-number">{displayNumber}</div>
        <h2 className="section-title">{section.title}</h2>
        <div className="section-status" title={`Заполнено ${filled} из ${total}`}>
          <span className="section-status-emoji" aria-hidden>
            {getStatusEmoji(status)}
          </span>
          <span className="section-status-text">
            {filled}/{total}
          </span>
        </div>
      </header>

      <div className="section-body">
        {section.fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            values={values}
            onPillChange={onPillChange}
            onCheckboxChange={onCheckboxChange}
            onTextChange={onTextChange}
          />
        ))}
      </div>
    </section>
  );
}
