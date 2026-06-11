/* Officers page: render officer grid + advisor banner from JSON,
   with tap-to-flip support for touch devices */

(function () {
  const grid = document.getElementById('officer-grid');
  if (!grid) return;

  fetch('data/officers.json')
    .then((r) => r.json())
    .then((data) => {
      renderOfficers(data.officers || []);
      renderAdvisor(data.advisor);
    })
    .catch(() => {
      grid.innerHTML = '<p class="empty-msg">Officer roster is temporarily unavailable.</p>';
    });

  function renderOfficers(officers) {
    if (officers.length === 0) {
      grid.innerHTML = '<p class="empty-msg">Officer roster coming soon.</p>';
      return;
    }

    grid.innerHTML = officers
      .map(
        (o) => `
        <div class="officer-card reveal" tabindex="0" role="button" aria-label="${escapeHtml(o.name)}, ${escapeHtml(o.role)} — tap for bio">
          <div class="card-inner">
            <div class="officer-face front">
              <div class="officer-photo">${personIcon()}</div>
              <div class="info">
                <h3>${escapeHtml(o.name)}</h3>
                <span class="role">${escapeHtml(o.role)}</span>
              </div>
            </div>
            <div class="officer-face back">
              <span class="role">${escapeHtml(o.major)}</span>
              <h3>${escapeHtml(o.name)}</h3>
              <p>${escapeHtml(o.bio)}</p>
              <a href="mailto:${escapeHtml(o.email)}">${escapeHtml(o.email)}</a>
            </div>
          </div>
        </div>
      `
      )
      .join('') + '<p class="officer-tap-hint" aria-hidden="true">Tap a card for bio &amp; contact</p>';

    grid.querySelectorAll('.officer-card').forEach((card) => {
      card.addEventListener('click', () => card.classList.toggle('is-flipped'));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('is-flipped');
        }
      });
    });

    observeReveals(grid);
  }

  function renderAdvisor(advisor) {
    const el = document.getElementById('advisor-banner');
    if (!el || !advisor) return;
    el.innerHTML = `
      <div>
        <span class="fig-label">Faculty Advisor</span>
        <h3 style="margin-top:0.4rem;">${escapeHtml(advisor.name)}</h3>
        <p style="color:var(--ink-soft); font-size:0.92rem; margin-top:0.3rem;">${escapeHtml(advisor.role)}</p>
      </div>
      <div style="max-width:28rem;">
        <p style="color:var(--ink-soft); font-size:0.92rem;">${escapeHtml(advisor.bio)}</p>
        <a class="cal-link" href="mailto:${escapeHtml(advisor.email)}" style="margin-top:0.5rem; display:inline-block;">${escapeHtml(advisor.email)}</a>
      </div>
    `;
  }

  function personIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
        <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
  }

  function observeReveals(container) {
    const els = container.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-visible'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((e) => obs.observe(e));
  }
})();
