/* About page: interactive reactor diagram tooltips */

(function () {
  const tooltip = document.getElementById('reactor-tooltip');
  const key = document.getElementById('reactor-key');
  if (!tooltip || !key) return;

  const INFO = {
    containment: {
      label: 'Containment Building',
      text: 'A thick steel-and-concrete structure that encloses the reactor, designed to contain radioactive material even in the event of an accident.',
    },
    core: {
      label: 'Reactor Core',
      text: 'Fuel rods undergo controlled nuclear fission, releasing heat that warms water flowing through the primary loop — no combustion involved.',
    },
    generator: {
      label: 'Steam Generator',
      text: 'Heat from the primary loop boils a separate supply of water into steam, without the two water systems ever mixing.',
    },
    turbine: {
      label: 'Turbine',
      text: 'Steam spins turbine blades connected to a generator, converting thermal energy into electricity — the same principle as any steam power plant.',
    },
    condenser: {
      label: 'Condenser',
      text: 'After passing through the turbine, steam is cooled back into water so it can be reused in the steam generator.',
    },
    cooling: {
      label: 'Cooling Tower',
      text: 'Releases waste heat to the atmosphere — that "steam" you see over a plant is actually just water vapor, not radioactive emissions.',
    },
  };

  const parts = document.querySelectorAll('.reactor-diagram .part');
  const keyItems = key.querySelectorAll('li');

  function activate(k) {
    const info = INFO[k];
    if (!info) return;

    tooltip.innerHTML = `<span class="fig-label">${escapeHtml(info.label)}</span><span><strong>${escapeHtml(info.label)}</strong> — ${escapeHtml(info.text)}</span>`;

    parts.forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-key') === k));
    keyItems.forEach((li) => li.classList.toggle('is-active', li.getAttribute('data-key') === k));
  }

  parts.forEach((p) => {
    const k = p.getAttribute('data-key');
    p.addEventListener('mouseenter', () => activate(k));
    p.addEventListener('click', () => activate(k));
  });

  keyItems.forEach((li) => {
    const k = li.getAttribute('data-key');
    li.addEventListener('mouseenter', () => activate(k));
    li.addEventListener('click', () => activate(k));
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
  }
})();
