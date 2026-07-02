export function CheckboxRow({
  id,
  label,
  checked,
  onChange,
  compact = false,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  compact?: boolean;
}) {
  return (
    <label className={`checkbox-row ${compact ? 'checkbox-row--compact' : ''}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="checkbox-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkbox-box" aria-hidden />
      <span className="checkbox-label">{label}</span>
    </label>
  );
}
