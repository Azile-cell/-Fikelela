# Fikelela — Hackathon MVP Demo

**Geekulcha Annual Hackathon 2026 — Localised Self-Learning Experiences track**

Fikelela helps learners discover free skills-training courses that match their
accessibility, device and data needs. It does not host or provide courses itself — it
helps people choose a suitable course *before* spending limited time or data on one that
turns out to be unusable.

This folder is a **static, front-end-only demo**: no backend, no login, no database, no
external API calls. It runs entirely from local sample data.

## Who Fikelela serves

Fikelela is intended for learners with different accessibility and digital-access
needs. This includes blind and low-vision learners, Deaf and hard-of-hearing learners,
people with physical disabilities, and students using limited data or basic devices.
The Access Profile therefore treats captions, transcripts, screen-reader support,
keyboard navigation, low-data availability and downloadable content as equally
important information.

---

## Project structure

```
FikelelaDemo/
├── index.html        Homepage — problem, solution, how it works
├── discover.html      Course discovery — search, filters, cards, compare, Access Profile
├── css/
│   └── styles.css     All styling
├── js/
│   ├── data.js         Local sample course + Access Profile data (demo data only)
│   └── app.js           Search, filter, modal, comparison and feedback logic
└── README.md          This file
```

## Running the demo

**Option 1 — just open it.** Double-click `index.html` (or `discover.html`) and it will
open directly in your browser. Every asset is a relative local file, so this works with
no server and no internet connection.

**Option 2 — local dev server** (recommended if your browser restricts local file access
for `fetch`/modules — this demo doesn't use either, but it's good practice):

```bash
cd FikelelaDemo
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

or with Node:

```bash
npx serve FikelelaDemo
```

## Demonstrating it to judges

1. **Start on the homepage.** It states the problem in one sentence — free courses exist,
   but "free" doesn't guarantee usable — and the three-step solution.
2. **Go to Discover and search** for something like "Python" or "data" to show live
   filtering.
3. **Turn on 2–3 accessibility filters** (e.g. Screen-reader support + Low-data
   availability) to show the course list narrowing to matching sample profiles.
4. **Open a course's Access Profile.** This is the core "nutrition label" idea — walk
   through a course with a "Partial" rating and read the note explaining *why* it's
   partial, not just a blanket yes/no.
5. **Tick "Add to compare" on 2–3 courses** and open the comparison table — a natural
   moment to show off the side-by-side Access Profile view.
6. **The strongest moment:** if you can, turn on a screen reader (NVDA/VoiceOver) and
   tab through the search, filters and a course card live, without looking at the
   screen. That's a demo judges remember.
7. **Point out the honesty layer** — the demo-data banner, the illustrative-profile
   disclaimer and the "Report an issue" button. Explain that real profiles would require
   documented testing and learner feedback before publication.

## What's mocked, and what a real version would need

| Feature | In this demo | In production |
|---|---|---|
| Course data | 9 hand-written sample courses in `data.js` | A real, growing, versioned database of verified courses |
| Access Profile verification | Illustrative ratings written for the demo | An actual testing process: keyboard-only pass, NVDA/JAWS/VoiceOver pass, automated WCAG scan, transcript/caption check — see the Geekulcha pitch deck for the full methodology |
| Feedback form | Submits nowhere; shows a confirmation message only | A real endpoint that logs reports for the review team, with status tracking |
| Search & filter | Runs entirely client-side over 9 records | Would need a real backend/search index once the catalog grows |
| "Go to course" links | Link to each provider's real course/learning hub page | Same, but ideally kept in sync with an affiliate-free, provider-agnostic catalog |
| Accounts / saved preferences | None — every visit starts fresh | Optional accounts so a learner's assistive-tech profile and data constraints are remembered |
| Crowdsourced reviews | Not implemented | Learners with different access needs submitting reviews for moderation and verification |

No backend, login, database, payment system or external API was added, per the brief for
this MVP — everything above is intentionally out of scope for the hackathon build.

## Accessibility work done in this demo

- Semantic HTML throughout (proper heading hierarchy, `<nav>`, `<main>`, `<fieldset>`/`<legend>` for filters, real `<button>`/`<a>` elements — no clickable `<div>`s)
- Designed for keyboard operation, including a focus trap, Escape-to-close in every modal, and focus returning to the triggering element on close
- A visible skip-to-content link and visible focus outlines (`:focus-visible`) throughout — never suppressed without a replacement
- Every accessibility rating is shown with an icon *and* a text label ("Yes" / "Partial" / "No" / "N/A") — never colour alone
- An `aria-live` region so filtering feedback can be announced to screen-reader users
- Badge information uses icons and text as well as colour; formal contrast testing should still be completed before production
- System font stack (no web-font download) — deliberately chosen to keep the page light for low-data users, matching the product's own value proposition

## Accessibility limitations that remain

This is a demo, not a finished, independently-audited product. Known gaps:

- No real screen-reader user has tested this build yet — every check above was done by
  the builder, not by someone who relies on assistive technology day to day. The pitch
  deck roadmap calls this out explicitly as a priority before further development.
- No automated WCAG scanner (e.g. axe, Lighthouse) has been run against this build — the
  contrast checks were done manually against the specific colour pairs in use, not a full
  automated audit.
- The comparison table has not been tested for how well it reads with a screen reader
  when it grows to 3 courses across 10 rows — long tables can be a real screen-reader
  pain point and would need dedicated testing.
- No support yet for reduced-motion preferences, right-to-left languages, or text
  resizing beyond the browser's own zoom.
- Only English is supported in this build; the pitch deck's localisation roadmap
  (isiZulu, isiXhosa, Sesotho, etc.) is not implemented here.

## Future improvements

- Real backend with a persistent, versioned course + Access Profile database
- A genuine verification pipeline (manual + automated + real assistive-tech user testing)
- Crowdsourced review submissions from disabled learners, moderated before publishing
- Deepen testing across blind/low-vision, Deaf/hard-of-hearing, motor and cognitive
  accessibility needs
- Multilingual interface and course-language filtering
- Save-for-later / personal accessibility profile so returning users don't need to
  re-select their filters every visit
