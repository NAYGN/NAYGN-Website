# NAYGN at UF — Website Project Plan

**Project:** Official website for the North American Young Generation in Nuclear (NAYGN) student chapter at the University of Florida
**Repository:** NAYGN-Website
**Date:** June 2026

---

## 1. Purpose & Goals

A student-led organization website that serves three core functions:

1. **Communicate** — publish notes and announcements from meetings.
2. **Inform** — keep an up-to-date schedule/agenda of meetings and events.
3. **Recruit** — give UF students clear, low-friction ways to get involved with the chapter.

### Audience
- **Primary:** UF undergraduate/graduate students curious about nuclear energy careers (may know nothing about NAYGN).
- **Secondary:** Current members checking the agenda and meeting notes.
- **Tertiary:** Faculty advisors, national NAYGN representatives, and industry sponsors evaluating the chapter's professionalism.

### Design inspiration
- **[naygn.org](https://naygn.org/)** — corporate-but-approachable, dark navy headers, card-based content blocks, professional nuclear imagery, "Energizing the Future of Nuclear" energy.
- **[ufl.edu](https://www.ufl.edu/)** — minimalist institutional look: generous whitespace, grid layouts, high contrast, thin orange accent rules separating sections, clean sans-serif typography.

**Vibe target:** Minimal, confident, and modern. Lots of whitespace, strong typography, restrained color used deliberately for accents — *not* a wall of colors or clutter.

---

## 2. Brand & Color Palette (UF × NAYGN mix)

| Role | Color | Hex | Source |
|------|-------|-----|--------|
| Primary / headers, nav, footer | UF Core Blue | `#0021A5` | UF official |
| Primary accent / CTAs, links, hover states | UF Orange | `#FA4616` | UF official |
| Secondary / section backgrounds, hero overlay | NAYGN Deep Navy | `#1B2A4A` (verify against NAYGN logo) | NAYGN |
| Secondary accent / icons, success states, "get involved" highlights | NAYGN Green | `#78BE20` (verify against NAYGN logo) | NAYGN |
| Background | Off-white | `#FAFAF8` | neutral |
| Text | Near-black | `#1A1A1A` | neutral |

**Usage rules (to keep it minimal):**
- Off-white background dominates (~80% of any viewport).
- Blue/navy reserved for the nav bar, footer, and hero band.
- Orange used sparingly: thin horizontal accent rules (UF-style), primary buttons, link hovers.
- Green used only for "get involved" / action moments so it reads as the *energy* color.
- Never more than 2 accent colors visible in one section.

> ⚠️ **Action item:** Verify exact NAYGN navy/green hex values from the chapter's logo file or national brand kit before launch.

### Typography
- **Headings:** A characterful geometric or humanist sans (e.g., *Archivo*, *Space Grotesk*, or *Urbanist* via Google Fonts) — bold weights, tight tracking, large scale for the minimal-editorial feel.
- **Body:** A highly readable sans (e.g., *Inter Tight* alternative such as *Public Sans* or *Source Sans 3*).
- Big type scale jumps (e.g., 4rem hero → 1rem body) to create hierarchy without decoration.

---

## 3. Site Structure & Pages

Global elements on every page:
- **Sticky top nav** — chapter logo left; Home, About Us, Officers, Agenda links right; mobile hamburger menu.
- **Footer** — UF blue/navy band with chapter email, social links (Instagram/LinkedIn/GroupMe/Discord), link to national naygn.org, and UF affiliation note.
- Thin orange accent rule separating major sections (UF-style signature detail).

### 3.1 Home (`index.html`)
The recruiting and "what's happening now" page.

| Section | Content | Interactivity / Visuals |
|---------|---------|------------------------|
| Hero | Full-width band, navy gradient or nuclear-themed imagery; headline like **"Energizing the Future of Nuclear at UF"**; two CTAs: *Get Involved* (green) and *View Agenda* (orange outline) | Subtle animated atom/orbit graphic (CSS/SVG animation); button hover effects |
| Announcements / Notes | Card list of the latest 3 notes/updates (newest first), each with date badge | Cards lift on hover; "View all" expands the list |
| Next Meeting | Prominent callout: date, time, location of the next general body meeting | Live **countdown timer** (JS) to the next meeting |
| Why Nuclear? | 3–4 stat tiles (e.g., "~20% of U.S. electricity," "Largest source of clean energy in the U.S.") | **Animated number count-up** on scroll into view |
| Get Involved | 3 cards: Join (GroupMe/Discord/listserv link or embedded interest form), Attend (next meeting), Lead (officer applications) | Hover states; link to embedded Google Form |
| Footer | As global | — |

### 3.2 About Us (`about.html`)
| Section | Content | Interactivity / Visuals |
|---------|---------|------------------------|
| Mission | What NAYGN is nationally + what the UF chapter does; pillars: Professional Development, Networking, Public Information, Knowledge Transfer | Pillar cards with icons that flip or expand on hover/tap |
| Our Story | Short history of the UF chapter | Simple vertical timeline that reveals on scroll |
| Nuclear 101 | Brief, friendly explainer of nuclear energy for non-engineering students | **Interactive reactor diagram** (SVG with hover tooltips on core, turbine, cooling tower, containment) |
| Affiliations | UF + national NAYGN logos, links | — |

### 3.3 Officers (`officers.html`)
| Section | Content | Interactivity / Visuals |
|---------|---------|------------------------|
| Officer grid | Responsive card grid: photo, name, position, major/year | Card flip or slide-up overlay on hover revealing short bio + email/LinkedIn |
| Faculty advisor | Separate highlighted card | — |
| Join leadership | Small CTA banner → application form | Green accent |

Placeholder headshot frames (orange/navy ring) until real photos are provided.

### 3.4 Agenda (`agenda.html`)
The page members will check most — must be effortless to update.

| Section | Content | Interactivity / Visuals |
|---------|---------|------------------------|
| Upcoming events | Chronological list: date block, title, time, location, short description, tag (General Meeting / Social / Industry Talk / Outreach) | **Filter buttons by tag**; "Add to calendar" (.ics download or Google Calendar link) per event |
| Semester view | Optional embedded Google Calendar for at-a-glance view | Embedded iframe |
| Past events & notes | Collapsible accordion per past meeting containing the meeting notes | Smooth expand/collapse |

**Content update strategy:** events and notes stored in a single `data/events.json` (and `data/notes.json`) file rendered by JavaScript — officers update one JSON file, never touch HTML.

---

## 4. Interactivity Summary (sitewide)

1. Smooth scrolling + scroll-reveal animations (IntersectionObserver, subtle fade/slide).
2. Countdown timer to next meeting (Home).
3. Animated stat counters (Home).
4. Interactive SVG reactor diagram with tooltips (About).
5. Officer card hover flips (Officers).
6. Event tag filtering + add-to-calendar (Agenda).
7. Accordion meeting notes archive (Agenda).
8. Mobile hamburger nav with slide-in drawer.
9. Micro-interactions: button hovers, link underline animations, card lifts — kept subtle to preserve the minimal vibe.

## 5. Nuclear-Themed Visuals

- **Animated atom/orbital motif** — lightweight SVG/CSS animation used in the hero and as a recurring decorative element (loading states, section dividers).
- **Interactive reactor cross-section diagram** (About page) — custom SVG, navy linework with orange/green highlights on hover.
- **Cooling tower / plant silhouette** — subtle line-art backgrounds in section bands.
- **Energy stat tiles** — iconography (atom, bolt, leaf, hard hat) in the NAYGN green.
- Photography: free-license nuclear plant imagery (e.g., Unsplash/DOE public domain) treated with a navy duotone overlay for consistency, replaced over time with real chapter event photos.

## 6. Technical Approach

| Decision | Choice | Why |
|----------|--------|-----|
| Stack | Static HTML + CSS + vanilla JS (no framework, no build step) | Free to host, easy for future officers with any skill level to maintain |
| Hosting | GitHub Pages from this repo | Free, automatic deploys on push, custom domain possible later |
| Styling | Single `css/styles.css` with CSS custom properties for the palette | Change brand colors in one place |
| Content | `data/events.json`, `data/notes.json`, `data/officers.json` | Officers edit data, not markup |
| Fonts | Google Fonts | Free, fast |
| Icons/diagrams | Inline SVG | Crisp, animatable, no dependencies |

### Proposed file structure
```
NAYGN-Website/
├── index.html              # Home
├── about.html              # About Us
├── officers.html           # Officers
├── agenda.html             # Agenda
├── css/
│   └── styles.css
├── js/
│   ├── main.js             # nav, scroll reveals, shared utils
│   ├── home.js             # countdown, stat counters
│   ├── agenda.js           # event rendering, filters, accordion
│   └── officers.js         # officer card rendering
├── data/
│   ├── events.json
│   ├── notes.json
│   └── officers.json
├── assets/
│   ├── img/                # photos, logos
│   └── svg/                # atom, reactor diagram, icons
├── PROJECT_PLAN.md
└── README.md
```

## 7. Accessibility & Quality Standards

- WCAG 2.1 AA color contrast (note: UF orange on white fails for small text — use it for large text/decoration only; darken for small-text links).
- Semantic HTML (nav, main, article, footer), keyboard-navigable menus and accordions, focus states.
- `prefers-reduced-motion` respected — all animations disabled for users who opt out.
- Fully responsive: 320px phones → widescreen; mobile-first CSS.
- Lighthouse targets: 90+ on Performance, Accessibility, Best Practices, SEO.
- Open Graph + meta tags so links shared in GroupMe/Discord preview nicely.

## 8. Build Phases

| Phase | Deliverable |
|-------|------------|
| 1. Foundation | Design tokens (colors, type), base CSS, nav + footer, page scaffolding |
| 2. Home | Hero w/ atom animation, announcements, countdown, stats, get-involved cards |
| 3. About Us | Mission pillars, timeline, interactive reactor diagram |
| 4. Officers | JSON-driven officer grid with hover bios |
| 5. Agenda | JSON-driven events w/ filtering, calendar links, notes accordion |
| 6. Polish | Scroll animations, responsive QA, accessibility pass, Lighthouse audit |
| 7. Launch | GitHub Pages deployment, README update with "how to update content" guide for officers |

## 9. Content Needed from the Chapter (action items)

- [ ] Chapter logo (and national NAYGN brand kit if available) — to confirm exact navy/green hex codes
- [ ] Officer names, positions, majors, photos, emails/LinkedIn
- [ ] Faculty advisor info
- [ ] Meeting schedule for the semester (dates, times, rooms)
- [ ] Links: GroupMe/Discord, Instagram, LinkedIn, interest form, listserv
- [ ] Chapter founding story / history blurb
- [ ] Any existing meeting notes to seed the archive
