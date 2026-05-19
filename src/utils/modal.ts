import { $, $$ } from './dom';

export function openModal(content: string | Node): void {
  const body = $('modalBody');
  body.innerHTML = '';
  if (typeof content === 'string') body.innerHTML = content;
  else body.append(content);
  $('modal').classList.remove('hidden');
}

export function closeModal(): void {
  $('modal').classList.add('hidden');
}

export function openForm(content: Node): void {
  const body = $('formBody');
  body.innerHTML = '';
  body.append(content);
  $('formModal').classList.remove('hidden');
}

export function closeForm(): void {
  $('formModal').classList.add('hidden');
}

export function initModals(): void {
  $$('[data-close]').forEach(b =>
    b.addEventListener('click', () => { closeModal(); closeForm(); })
  );
  [$('modal'), $('formModal')].forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) { closeModal(); closeForm(); }
    });
  });
}
