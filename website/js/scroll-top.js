document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.scroll-top-btn')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'scroll-top-btn';
  button.setAttribute('aria-label', 'Back to top');
  button.innerHTML = `
    <span class="scroll-top-btn-label">Back to top</span>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5.5l-6.5 6.5 1.4 1.4 4.1-4.1V20h2V9.3l4.1 4.1 1.4-1.4z"></path>
    </svg>
  `;

  const toggleVisibility = () => {
    const shouldShow = window.scrollY > 260;
    button.classList.toggle('is-visible', shouldShow);
  };

  const updateSurfaceMode = () => {
    const rect = button.getBoundingClientRect();
    const probeX = Math.max(0, Math.min(window.innerWidth - 1, rect.left + rect.width / 2));
    const probeY = Math.max(0, Math.min(window.innerHeight - 1, rect.top + rect.height / 2));
    const elementBelow = document.elementFromPoint(probeX, probeY);
    const isDarkSurface = !!(elementBelow && elementBelow.closest('footer, .intro-screen'));

    button.classList.toggle('is-on-dark', isDarkSurface);
  };

  const syncButtonState = () => {
    toggleVisibility();
    updateSurfaceMode();
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(button);
  syncButtonState();
  window.addEventListener('scroll', syncButtonState, { passive: true });
  window.addEventListener('resize', syncButtonState);
});
