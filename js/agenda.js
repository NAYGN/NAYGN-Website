/* Agenda page: upcoming events with tag filters + .ics download,
   and a collapsible archive of past meeting notes */

(function () {
  const list = document.getElementById('event-list');
  const filterBar = document.getElementById('filter-bar');
  if (!list) return;

  let events = [];
  let activeTag = 'all';

  fetch('data/events.json')
    .then((r) => r.json())
    .then((data) => {
      events = (data.upcoming || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
      render();
      const past = (data.past || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
      renderPast(past);
    })
    .catch(() => {
      list.innerHTML = '<p class="empty-msg">Unable to load the agenda right now.</p>';
    });

  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeTag = btn.getAttribute('data-tag');
      render();
    });
  }

  const TAG_LABELS = {
    general: 'General Meeting',
    social: 'Social',
    industry: 'Industry Talk',
    outreach: 'Outreach',
  };

  function render() {
    const filtered = events.filter((ev) => activeTag === 'all' || ev.tag === activeTag);

    if (filtered.length === 0) {
      list.innerHTML = '<p class="empty-msg">No events match this filter yet.</p>';
      return;
    }

    list.innerHTML = filtered
      .map((ev) => {
        const date = new Date(ev.date + 'T00:00:00');
        const day = date.toLocaleDateString('en-US', { day: '2-digit' });
        const mon = date.toLocaleDateString('en-US', { month: 'short' });
        const tagClass = `tag-${ev.tag}`;
        const tagLabel = TAG_LABELS[ev.tag] || ev.tag;

        return `
          <article class="event-row reveal is-visible">
            <div class="event-date">
              <span class="day">${day}</span>
              <span class="mon">${mon}</span>
            </div>
            <div class="event-body">
              <span class="event-tag ${tagClass}">${escapeHtml(tagLabel)}</span>
              <h3>${escapeHtml(ev.title)}</h3>
              <div class="meta">${escapeHtml(ev.time)} · ${escapeHtml(ev.location)}</div>
              <p>${escapeHtml(ev.description)}</p>
            </div>
            <div class="event-actions">
              <a class="cal-link" href="${buildIcsHref(ev)}" download="${slugify(ev.title)}.ics">+ Add to calendar</a>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function renderPast(past) {
    const container = document.getElementById('past-events');
    if (!container) return;

    if (past.length === 0) {
      container.innerHTML = '<p class="empty-msg">No past meeting notes yet.</p>';
      return;
    }

    container.innerHTML = past
      .map((ev, i) => {
        const date = new Date(ev.date + 'T00:00:00');
        const dateStr = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        const notesList = (ev.notes || []).map((n) => `<li>${escapeHtml(n)}</li>`).join('');

        return `
          <div class="accordion-item" data-index="${i}">
            <button class="accordion-trigger" aria-expanded="false">
              <span>
                <span class="t-date">${dateStr}</span>
                <h3>${escapeHtml(ev.title)}</h3>
              </span>
              <span class="accordion-icon" aria-hidden="true"></span>
            </button>
            <div class="accordion-panel">
              <div class="accordion-panel-inner">
                <p>${escapeHtml(ev.summary)}</p>
                <ul>${notesList}</ul>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    container.querySelectorAll('.accordion-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const panel = item.querySelector('.accordion-panel');
        const isOpen = item.classList.contains('is-open');

        if (isOpen) {
          panel.style.maxHeight = '0px';
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          panel.style.maxHeight = panel.scrollHeight + 'px';
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function buildIcsHref(ev) {
    const start = parseIcsDate(ev.date, ev.time, false);
    const end = parseIcsDate(ev.date, ev.time, true);
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NAYGN at UF//Agenda//EN',
      'BEGIN:VEVENT',
      `UID:${slugify(ev.title)}-${ev.date}@naygn-uf`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${icsEscape(ev.title)}`,
      `LOCATION:${icsEscape(ev.location)}`,
      `DESCRIPTION:${icsEscape(ev.description)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  }

  function parseIcsDate(dateStr, timeStr, isEnd) {
    const [y, m, d] = dateStr.split('-').map(Number);
    let hour = 18,
      minute = 0;

    const match = (timeStr || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      hour = parseInt(match[1], 10);
      minute = parseInt(match[2], 10);
      const ampm = (match[3] || '').toUpperCase();
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
    }

    if (isEnd) hour += 1; // default 1hr duration

    const dt = new Date(y, m - 1, d, hour, minute);
    const pad = (n) => String(n).padStart(2, '0');
    return (
      dt.getFullYear() +
      pad(dt.getMonth() + 1) +
      pad(dt.getDate()) +
      'T' +
      pad(dt.getHours()) +
      pad(dt.getMinutes()) +
      '00'
    );
  }

  function icsEscape(str) {
    return String(str || '').replace(/[\\,;]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
  }

  function slugify(str) {
    return String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
  }
})();
