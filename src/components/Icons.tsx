export function ClipboardIcon({ dark = false }: { dark?: boolean }) {
  const color = dark ? '#171717' : '#A1A1A1';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="5.33" y="5.33" width="9.33" height="9.33" rx="1.5" stroke={color} strokeWidth="1.33" />
      <rect x="1.33" y="1.33" width="9.33" height="9.33" rx="1.5" stroke={color} strokeWidth="1.33" />
    </svg>
  );
}

export function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5.33 1.33h5.33" stroke="#E5E5E5" strokeWidth="1.33" strokeLinecap="round" />
      <rect x="2.67" y="2.67" width="10.67" height="12" rx="1.5" stroke="#E5E5E5" strokeWidth="1.33" />
    </svg>
  );
}
