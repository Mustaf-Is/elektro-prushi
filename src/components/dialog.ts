/** Keep keyboard focus within a native modal, including at browser-chrome boundaries. */
export function containFocus(dialog: HTMLDialogElement) {
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = Array.from(
      dialog.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]'),
    ).filter((el) => !el.hasAttribute('disabled'));
    const first = controls[0],
      last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
}
