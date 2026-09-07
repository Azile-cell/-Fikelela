/*
 * Fikelela demo — app logic
 * No backend, no external calls. All state lives in memory for the
 * duration of the page session (see README.md for why localStorage
 * was deliberately left out of this build).
 */

(function () {
  'use strict';

  // ---------- tiny icon helpers (inline SVG, no image files) ----------
  const ICONS = {
    yes: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    partial: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15"/><path d="M6 10h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    no: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    na: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15"/><circle cx="10" cy="10" r="1.4" fill="currentColor"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  const LEVEL_LABEL = { yes: 'Yes', partial: 'Partial', no: 'No', na: 'N/A' };

  function badgeHtml(level, attrLabel) {
    const cls = level in LEVEL_LABEL ? level : 'na';
    return `<span class="badge ${cls}">${ICONS[cls]}<span>${attrLabel}: ${LEVEL_LABEL[cls]}</span></span>`;
  }

  function compactBadgeHtml(level, attrLabel) {
    // Used on cards: icon + short label, colour is never the only signal.
    const cls = level in LEVEL_LABEL ? level : 'na';
    return `<span class="badge ${cls}" title="${attrLabel}: ${LEVEL_LABEL[cls]}">${ICONS[cls]}<span>${LEVEL_LABEL[cls]}</span></span>`;
  }

  // ---------- state ----------
  let activeFilters = new Set();
  let searchTerm = '';
  let compareSet = new Set();
  const MAX_COMPARE = 3;
  let lastFocusedEl = null;

  // ---------- rendering: course grid ----------
  function courseMatches(course) {
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      const haystack = (course.name + ' ' + course.topic + ' ' + course.provider).toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    for (const key of activeFilters) {
      const level = course.access[key].level;
      if (level === 'no' || level === 'na') return false;
    }
    return true;
  }

  function renderGrid() {
    const grid = document.getElementById('courseGrid');
    const countEl = document.getElementById('resultsCount');
    const empty = document.getElementById('emptyState');
    if (!grid) return;

    const results = FIKELELA_COURSES.filter(courseMatches);
    countEl.textContent = `${results.length} course${results.length === 1 ? '' : 's'} shown`;

    if (results.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    grid.innerHTML = results.map(courseCardHtml).join('');

    // wire per-card buttons
    grid.querySelectorAll('[data-open-course]').forEach(btn => {
      btn.addEventListener('click', () => openAccessModal(btn.getAttribute('data-open-course')));
    });
    grid.querySelectorAll('[data-feedback-course]').forEach(btn => {
      btn.addEventListener('click', () => openFeedbackModal(btn.getAttribute('data-feedback-course')));
    });
    grid.querySelectorAll('[data-compare-toggle]').forEach(chk => {
      chk.checked = compareSet.has(chk.getAttribute('data-compare-toggle'));
      chk.addEventListener('change', onCompareToggle);
    });
  }

  function courseCardHtml(course) {
    const a = course.access;
    return `
    <article class="course-card" aria-labelledby="title-${course.id}">
      <span class="topic-tag">${course.topic}</span>
      <h3 id="title-${course.id}">${course.name}</h3>
      <p class="provider">${course.provider}</p>
      <div class="meta-row">
        <span>${course.level}</span>
        <span>${course.free}</span>
        <span>Sample profile date ${formatDate(course.reviewed)}</span>
      </div>
      <div class="access-badges" aria-label="Accessibility summary">
        ${compactBadgeHtml(a.screenReader.level, 'Screen reader')}
        ${compactBadgeHtml(a.captions.level, 'Captions')}
        ${compactBadgeHtml(a.lowData.level, 'Low-data')}
      </div>
      <div class="card-actions">
        <button type="button" class="btn small" data-open-course="${course.id}">View Access Profile</button>
        <button type="button" class="btn small secondary" data-feedback-course="${course.id}">Report an issue</button>
      </div>
      <label class="compare-check">
        <input type="checkbox" data-compare-toggle="${course.id}" aria-describedby="compare-hint">
        Add to compare
      </label>
    </article>`;
  }

  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ---------- search + filters ----------
  function wireToolbar() {
    const search = document.getElementById('searchInput');
    if (search) {
      search.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderGrid();
      });
    }
    document.querySelectorAll('[data-filter-key]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const key = e.target.getAttribute('data-filter-key');
        if (e.target.checked) activeFilters.add(key);
        else activeFilters.delete(key);
        renderGrid();
      });
    });
  }

  // ---------- Access Profile modal ----------
  function openAccessModal(courseId) {
    const course = FIKELELA_COURSES.find(c => c.id === courseId);
    if (!course) return;
    const overlay = document.getElementById('accessModalOverlay');
    const body = document.getElementById('accessModalBody');

    body.innerHTML = `
      <h2 id="accessModalTitle">${course.name}</h2>
      <p class="modal-provider">${course.provider}</p>
      <div class="modal-meta">
        <span>${course.topic}</span>
        <span>${course.level}</span>
        <span>${course.free}</span>
        <span>Sample profile date ${formatDate(course.reviewed)}</span>
      </div>
      <div class="access-list">
        ${ACCESS_ATTRS.map(attr => {
          const a = course.access[attr.key];
          const cls = a.level in LEVEL_LABEL ? a.level : 'na';
          return `
          <div class="access-row">
            <span class="badge ${cls}">${ICONS[cls]}<span>${LEVEL_LABEL[cls]}</span></span>
            <div>
              <div class="att-label">${attr.label}</div>
              <div class="att-note">${a.note}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="disclaimer-box">
        ${ICONS.info}
        <p style="margin:0;">This is an illustrative Access Profile for the hackathon demo. It has not been independently audited and is not a guarantee of accessibility. A production profile would be based on documented manual and automated checks and learner feedback. <button type="button" class="link-btn" id="modalReportLink">Report an issue</button>.</p>
      </div>
      <div class="modal-footer">
        <a class="btn secondary" href="${course.sourceUrl}" target="_blank" rel="noopener">Go to course on ${course.provider}</a>
        <button type="button" class="link-btn" data-feedback-course="${course.id}" id="modalFeedbackBtn">Report incorrect info</button>
      </div>
    `;

    body.querySelector('#modalReportLink').addEventListener('click', () => { closeModal(overlay); openFeedbackModal(course.id); });
    body.querySelector('#modalFeedbackBtn').addEventListener('click', () => { closeModal(overlay); openFeedbackModal(course.id); });

    openModal(overlay, 'accessModalTitle');
  }

  // ---------- Compare ----------
  function onCompareToggle(e) {
    const id = e.target.getAttribute('data-compare-toggle');
    if (e.target.checked) {
      if (compareSet.size >= MAX_COMPARE) {
        e.target.checked = false;
        announce(`You can compare up to ${MAX_COMPARE} courses at a time.`);
        return;
      }
      compareSet.add(id);
    } else {
      compareSet.delete(id);
    }
    updateCompareBar();
  }

  function updateCompareBar() {
    const bar = document.getElementById('compareBar');
    const names = document.getElementById('compareNames');
    if (!bar) return;
    if (compareSet.size >= 2) {
      bar.classList.add('show');
      const list = [...compareSet].map(id => FIKELELA_COURSES.find(c => c.id === id).name);
      names.innerHTML = `Comparing <strong>${list.join('</strong>, <strong>')}</strong>`;
    } else {
      bar.classList.remove('show');
    }
  }

  function openCompareModal() {
    const overlay = document.getElementById('compareModalOverlay');
    const body = document.getElementById('compareModalBody');
    const courses = [...compareSet].map(id => FIKELELA_COURSES.find(c => c.id === id));

    const rows = [
      ['Provider', c => c.provider],
      ['Topic', c => c.topic],
      ['Level', c => c.level],
      ['Free status', c => c.free],
      ...ACCESS_ATTRS.map(attr => [attr.label, c => {
        const a = c.access[attr.key];
        const cls = a.level in LEVEL_LABEL ? a.level : 'na';
        return `<span class="badge ${cls}">${ICONS[cls]}<span>${LEVEL_LABEL[cls]}</span></span>`;
      }]),
      ['Sample profile date', c => formatDate(c.reviewed)]
    ];

    body.innerHTML = `
      <h2 id="compareModalTitle">Compare courses</h2>
      <p class="modal-provider">Side-by-side Access Profile comparison — demo data.</p>
      <div style="overflow-x:auto;">
      <table class="compare-table">
        <thead>
          <tr><th class="row-label">&nbsp;</th>${courses.map(c => `<th>${c.name}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(([label, fn]) => `<tr><th class="row-label">${label}</th>${courses.map(c => `<td>${fn(c)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
      </div>
    `;
    openModal(overlay, 'compareModalTitle');
  }

  // ---------- Feedback ----------
  function openFeedbackModal(courseId) {
    const overlay = document.getElementById('feedbackModalOverlay');
    const body = document.getElementById('feedbackModalBody');
    const course = FIKELELA_COURSES.find(c => c.id === courseId);

    body.innerHTML = `
      <h2 id="feedbackModalTitle">Report an accessibility issue</h2>
      <p class="modal-provider">${course ? `About: ${course.name}` : 'General feedback'}</p>
      <form class="feedback-form" id="feedbackForm">
        <label for="fbCourse">Course</label>
        <select id="fbCourse">
          <option value="" ${courseId ? '' : 'selected'}>General feedback (not course-specific)</option>
          ${FIKELELA_COURSES.map(c => `<option value="${c.id}" ${c.id === courseId ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>

        <label for="fbIssue">What's wrong or out of date?</label>
        <textarea id="fbIssue" required aria-required="true" placeholder="e.g. The course now includes audio description on all videos, this profile is out of date."></textarea>

        <label for="fbEmail">Your email (optional, if you'd like a reply)</label>
        <input type="email" id="fbEmail" placeholder="you@example.com">

        <div style="margin-top:18px; display:flex; gap:10px; align-items:center;">
          <button type="submit" class="btn">Submit report</button>
          <span id="fbHint" style="font-size:12.5px; color:var(--slate);">Demo only — nothing is actually sent.</span>
        </div>
        <div class="form-success" id="fbSuccess" role="status">Thanks — in the full version this would reach our review team for a re-check.</div>
      </form>
    `;

    body.querySelector('#feedbackForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const issueField = body.querySelector('#fbIssue');
      if (!issueField.value.trim()) { issueField.focus(); return; }
      body.querySelector('#feedbackForm').querySelectorAll('input, textarea, select, button[type="submit"]').forEach(el => el.disabled = true);
      body.querySelector('#fbSuccess').classList.add('show');
    });

    openModal(overlay, 'feedbackModalTitle');
  }

  // ---------- generic modal open/close with focus handling ----------
  function openModal(overlay, titleId) {
    lastFocusedEl = document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    const modal = overlay.querySelector('.modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', titleId);
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();

    function trap(e) {
      if (e.key === 'Escape') { closeModal(overlay); return; }
      if (e.key !== 'Tab') return;
      const focusables = modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusables.length === 0) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    overlay._trap = trap;
    document.addEventListener('keydown', trap);
  }

  function closeModal(overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    if (overlay._trap) document.removeEventListener('keydown', overlay._trap);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function wireModalShell(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;
    overlay.querySelector('.modal-close').addEventListener('click', () => closeModal(overlay));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay); });
  }

  // ---------- live region for filter feedback ----------
  function announce(msg) {
    const region = document.getElementById('liveRegion');
    if (region) region.textContent = msg;
  }

  // ---------- init ----------
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('courseGrid')) {
      renderGrid();
      wireToolbar();
      wireModalShell('accessModalOverlay');
      wireModalShell('compareModalOverlay');
      wireModalShell('feedbackModalOverlay');

      const compareBtn = document.getElementById('compareBtn');
      if (compareBtn) compareBtn.addEventListener('click', openCompareModal);

      const generalFeedbackBtn = document.getElementById('generalFeedbackBtn');
      if (generalFeedbackBtn) generalFeedbackBtn.addEventListener('click', () => openFeedbackModal(null));
    }
  });
})();
