import type { PillOption } from '../types';

type PillGroupProps = {
  options: PillOption[];
  value: string | string[];
  multiple?: boolean;
  onChange: (optionId: string) => void;
};

export function PillGroup({ options, value, multiple, onChange }: PillGroupProps) {
  const selected = multiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === 'string'
      ? [value]
      : [];

  return (
    <div className="pill-group">
      {options.map((option) => {
        const active = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            className={`pill ${active ? 'pill--active' : ''}`}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
