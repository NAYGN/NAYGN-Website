/* Calendar page: upcoming events with tag filters + .ics download */

(function () {
  const list = document.getElementById('event-list');
  const filterBar = document.getElementById('filter-bar');
  if (!list) return;

  let events = [];
  let activeTag = 'all';

  function isValidDate(d) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  fetch('data/events.json')
    .then((r) => r.json())
    .then((data) => {
      events = (data.upcoming || []).slice().sort((a, b) => {
        const ad = new Date(a.date);
        const bd = new Date(b.date);
        const aBad = !isValidDate(ad);
        const bBad = !isValidDate(bd);
        if (aBad || bBad) return aBad === bBad ? 0 : aBad ? 1 : -1;
        return ad - bd;
      });
      render();
      renderCalendar(events);
    })
    .catch(() => {
      list.innerHTML = '<p class="empty-msg">Unable to load the calendar right now.</p>';
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
        const parsedDate = new Date(ev.date + 'T00:00:00');
        const isTbd = !isValidDate(parsedDate);
        const date = isTbd ? null : parsedDate;
        const day = isTbd ? 'TBD' : date.toLocaleDateString('en-US', { day: '2-digit' });
        const mon = isTbd ? '' : date.toLocaleDateString('en-US', { month: 'short' });
        const tagClass = `tag-${ev.tag}`;
        const tagLabel = TAG_LABELS[ev.tag] || ev.tag;
        const timeIsTbd = !ev.time || ev.time === 'TBD';
        const locIsTbd = !ev.location || ev.location === 'TBD';
        const metaText = timeIsTbd && locIsTbd
          ? 'Date, time & location to be announced'
          : `${timeIsTbd ? 'Time TBD' : ev.time} · ${locIsTbd ? 'Location TBD' : ev.location}`;
        const hasSections = (ev.sections || []).length > 0;
        const hasDetails = hasSections || (ev.details || []).length > 0;
        const panelContent = hasSections
          ? ev.sections.map((sec) => `
              <div class="event-section">
                <p class="event-section-heading">${escapeHtml(sec.heading)}</p>
                <ul class="event-details-list">${sec.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
              </div>`).join('')
          : `<ul class="event-details-list">${(ev.details || []).map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>`;

        return `
          <article class="event-row reveal is-visible${hasDetails ? ' is-expandable' : ''}">
            <div class="event-date">
              <span class="day">${day}</span>
              <span class="mon">${mon}</span>
            </div>
            <div class="event-body">
              <span class="event-tag ${tagClass}">${escapeHtml(tagLabel)}</span>
              <h3>${escapeHtml(ev.title)}</h3>
              <div class="meta">${escapeHtml(metaText)}</div>
              <p>${escapeHtml(ev.description)}</p>
              ${hasDetails ? `
              <div class="event-panel">
                <div class="event-panel-inner">${panelContent}</div>
              </div>` : ''}
            </div>
            <div class="event-actions">
              ${isTbd ? '' : `<a class="cal-link" href="${buildIcsHref(ev)}" download="${slugify(ev.title)}.ics">+ Add to calendar</a>`}
              ${hasDetails ? '<span class="event-chevron" aria-hidden="true"></span>' : ''}
            </div>
          </article>
        `;
      })
      .join('');

    list.querySelectorAll('.event-row.is-expandable').forEach((article) => {
      article.addEventListener('click', (e) => {
        if (e.target.closest('.cal-link')) return;
        const panel = article.querySelector('.event-panel');
        const isOpen = article.classList.contains('is-open');
        if (isOpen) {
          panel.style.maxHeight = '0';
          article.classList.remove('is-open');
        } else {
          panel.style.maxHeight = panel.scrollHeight + 'px';
          article.classList.add('is-open');
        }
      });
    });
  }

  function renderCalendar(events) {
    const container = document.getElementById('semester-calendar');
    if (!container) return;

    const datedEvents = events.filter((ev) => isValidDate(new Date(ev.date + 'T00:00:00')));

    const eventMap = {};
    datedEvents.forEach((ev) => { eventMap[ev.date] = ev; });

    const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    const firstEvent = datedEvents[0] ? new Date(datedEvents[0].date + 'T00:00:00') : new Date();
    let curYear = firstEvent.getFullYear();
    let curMonth = firstEvent.getMonth();

    function buildMonth(year, month) {
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const headers = DAY_ABBR.map((d) => `<div class="cal-hdr">${d}</div>`).join('');
      let cells = '';
      for (let i = 0; i < firstDay; i++) cells += '<div class="cal-day"></div>';
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const ev = eventMap[dateStr];
        cells += ev
          ? `<div class="cal-day has-event">
               <span class="cal-num">${d}</span>
               <span class="cal-ev-title">${escapeHtml(ev.title)}</span>
               <span class="cal-ev-time">${escapeHtml(ev.time)}</span>
             </div>`
          : `<div class="cal-day"><span class="cal-num">${d}</span></div>`;
      }
      return `<div class="cal-grid">${headers}${cells}</div>`;
    }

    function draw() {
      container.innerHTML = `
        <div class="cal-month">
          <div class="cal-nav">
            <button class="cal-nav-btn" id="cal-prev" aria-label="Previous month">&#8592;</button>
            <h3 class="cal-month-name">${MONTH_NAMES[curMonth]} ${curYear}</h3>
            <button class="cal-nav-btn" id="cal-next" aria-label="Next month">&#8594;</button>
          </div>
          ${buildMonth(curYear, curMonth)}
        </div>`;

      document.getElementById('cal-prev').addEventListener('click', () => {
        curMonth--;
        if (curMonth < 0) { curMonth = 11; curYear--; }
        draw();
      });
      document.getElementById('cal-next').addEventListener('click', () => {
        curMonth++;
        if (curMonth > 11) { curMonth = 0; curYear++; }
        draw();
      });
    }

    draw();
  }

  function buildIcsHref(ev) {
    const start = parseIcsDate(ev.date, ev.time, false);
    const end = parseIcsDate(ev.date, ev.time, true);
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NAYGN at UF//Calendar//EN',
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
