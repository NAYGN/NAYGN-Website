/* Home page: announcements, countdown timer, animated stat counters */

(function () {
  const list = document.getElementById('announcement-list');
  if (!list) return;

  fetch('data/notes.json')
    .then((r) => r.json())
    .then((data) => {
      const items = (data.announcements || []).slice(0, 3);
      if (items.length === 0) {
        list.innerHTML = '<p class="empty-msg">No announcements yet — check back soon.</p>';
        return;
      }
      list.innerHTML = items
        .map((item) => {
          const date = new Date(item.date + 'T00:00:00');
          const dateStr = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          return `
            <article class="note-card reveal">
              <span class="date">${dateStr}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.body)}</p>
            </article>
          `;
        })
        .join('');
      observeReveals(list);
    })
    .catch(() => {
      list.innerHTML = '<p class="empty-msg">Announcements are temporarily unavailable.</p>';
    });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
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
      { threshold: 0.15 }
    );
    els.forEach((e) => obs.observe(e));
  }
})();

/* ---------------- Countdown timer ---------------- */
(function () {
  const root = document.getElementById('next-meeting');
  if (!root) return;

  fetch('data/events.json')
    .then((r) => r.json())
    .then((data) => {
      const meeting = data.nextMeeting;
      if (!meeting) return;

      const titleEl = root.querySelector('[data-field="title"]');
      const locEl = root.querySelector('[data-field="location"]');
      const noteEl = root.querySelector('[data-field="note"]');
      const whenEl = root.querySelector('[data-field="when"]');

      const target = new Date(meeting.date);

      if (titleEl) titleEl.textContent = meeting.title;
      if (locEl) locEl.textContent = meeting.location;
      if (noteEl) noteEl.textContent = meeting.note || '';
      if (whenEl) {
        whenEl.textContent = target.toLocaleString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
      }

      const days = root.querySelector('[data-unit="days"]');
      const hours = root.querySelector('[data-unit="hours"]');
      const mins = root.querySelector('[data-unit="minutes"]');
      const secs = root.querySelector('[data-unit="seconds"]');

      function tick() {
        const now = new Date();
        let diff = target - now;

        if (diff <= 0) {
          if (days) days.textContent = '00';
          if (hours) hours.textContent = '00';
          if (mins) mins.textContent = '00';
          if (secs) secs.textContent = '00';
          clearInterval(timer);
          return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= d * (1000 * 60 * 60 * 24);
        const h = Math.floor(diff / (1000 * 60 * 60));
        diff -= h * (1000 * 60 * 60);
        const m = Math.floor(diff / (1000 * 60));
        diff -= m * (1000 * 60);
        const s = Math.floor(diff / 1000);

        if (days) days.textContent = String(d).padStart(2, '0');
        if (hours) hours.textContent = String(h).padStart(2, '0');
        if (mins) mins.textContent = String(m).padStart(2, '0');
        if (secs) secs.textContent = String(s).padStart(2, '0');
      }

      tick();
      const timer = setInterval(tick, 1000);
    })
    .catch(() => {});
})();

/* ---------------- Animated stat counters ---------------- */
(function () {
  const stats = document.querySelectorAll('[data-count]');
  if (stats.length === 0) return;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = el.getAttribute('data-decimals')
      ? parseInt(el.getAttribute('data-decimals'), 10)
      : 0;
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  };

  if (!('IntersectionObserver' in window)) {
    stats.forEach(animate);
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  stats.forEach((s) => obs.observe(s));
})();
