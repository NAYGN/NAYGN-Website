/* About page: interactive reactor diagrams (PWR + AGR) with tooltips + tabs */

(function () {
  const tooltip = document.getElementById('reactor-tooltip');
  if (!tooltip) return;

  const INFO = {
    /* ---- Pressurized Water Reactor ---- */
    containment: {
      label: 'Containment Structure',
      text: 'A sealed steel-and-concrete dome enclosing the reactor and primary loop, built to keep radioactive material inside even during an accident.',
    },
    rpv: {
      label: 'Reactor Pressure Vessel',
      text: 'A thick steel vessel that houses the nuclear fuel and control rods. Pressurized water flows through it, carrying heat away from the fissioning core.',
    },
    pressurizer: {
      label: 'Pressure Tank (Pressurizer)',
      text: 'Holds the primary-loop water under enough pressure that it stays liquid at high temperature instead of boiling.',
    },
    generator: {
      label: 'Steam Generator',
      text: 'Heat from the reactor coolant boils a separate supply of water into steam, without the two water systems ever mixing.',
    },
    turbine: {
      label: 'Turbine',
      text: 'High-pressure steam spins the turbine blades, which are connected by a shaft to the electric generator.',
    },
    egen: {
      label: 'Electric Generator',
      text: 'The spinning shaft turns a generator that converts mechanical motion into electricity, which flows out to the grid.',
    },
    condenser: {
      label: 'Condenser',
      text: 'Cools the used steam back into water so it can be pumped to the steam generator and reused, closing the loop.',
    },
    cooling: {
      label: 'Cooling Tower',
      text: 'Releases leftover waste heat to the atmosphere. The plume you see is harmless water vapor, not radioactive emissions.',
    },

    /* ---- Advanced Gas-cooled Reactor ---- */
    shielding: {
      label: 'Concrete Shielding',
      text: 'A massive concrete biological shield surrounding the reactor that absorbs radiation and protects workers and the environment.',
    },
    vessel: {
      label: 'Steel Pressure Vessel',
      text: 'Contains the graphite core and pressurized carbon-dioxide coolant, holding the gas at high pressure as it circulates through the reactor.',
    },
    moderator: {
      label: 'Graphite Moderator',
      text: 'Blocks of graphite slow down the neutrons released by fission so the chain reaction can sustain itself — the defining feature of a gas-cooled reactor.',
    },
    fuel: {
      label: 'Fuel Assemblies',
      text: 'Enriched uranium-dioxide pellets in stainless-steel cladding, arranged in channels through the graphite where fission takes place.',
    },
    rods: {
      label: 'Control Rods',
      text: 'Neutron-absorbing rods raised or lowered into the core to control the rate of fission — or to shut the reactor down entirely.',
    },
    coolant: {
      label: 'Cooling Gas (CO₂)',
      text: 'Pressurized carbon-dioxide gas is driven through the hot core, carrying heat to the steam generator. AGRs run hotter than water-cooled reactors, giving higher efficiency.',
    },
    circulator: {
      label: 'Gas Circulator',
      text: 'Powerful fans that continuously drive the carbon-dioxide coolant around the primary circuit, from the boiler back through the reactor core.',
    },
  };

  const DEFAULT_TIP = tooltip.innerHTML;

  const tabs = document.querySelectorAll('.reactor-tab');
  const svgs = document.querySelectorAll('.reactor-svg');
  const keyLists = document.querySelectorAll('.reactor-key');
  const parts = document.querySelectorAll('.reactor-diagram .part');
  const keyItems = document.querySelectorAll('.reactor-key li');

  function activate(k) {
    const info = INFO[k];
    if (!info) return;
    tooltip.innerHTML =
      `<span class="fig-label">${escapeHtml(info.label)}</span>` +
      `<span><strong>${escapeHtml(info.label)}</strong> — ${escapeHtml(info.text)}</span>`;
    parts.forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-key') === k));
    keyItems.forEach((li) => li.classList.toggle('is-active', li.getAttribute('data-key') === k));
  }

  function reset() {
    tooltip.innerHTML = DEFAULT_TIP;
    parts.forEach((p) => p.classList.remove('is-active'));
    keyItems.forEach((li) => li.classList.remove('is-active'));
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

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const d = tab.getAttribute('data-diagram');
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      svgs.forEach((s) => s.classList.toggle('is-hidden', s.getAttribute('data-diagram') !== d));
      keyLists.forEach((k) => k.classList.toggle('is-hidden', k.getAttribute('data-diagram') !== d));
      reset();
    });
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
  }
})();
