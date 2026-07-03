export function scrollToFormField(targetId: string) {
  const el = document.getElementById(`field-${targetId}`);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('field-anchor--highlight');
  window.setTimeout(() => el.classList.remove('field-anchor--highlight'), 2200);
}
