(function () {
  'use strict';

  var searchInput = document.getElementById('interview-search-input');
  var resultsContainer = document.getElementById('interview-results');

  if (!searchInput || !resultsContainer) return;

  var dataEl = document.getElementById('interview-data');
  var interviewData = [];
  try {
    interviewData = JSON.parse(dataEl.textContent).filter(function (item) {
      return item.answer && item.answer.trim() !== '';
    });
  } catch (e) {
    resultsContainer.innerHTML = '<p class="search-no-results">Unable to load the FAQ data.</p>';
    return;
  }

  var renderedItems = [];

  /* ---- Tokenize: split on whitespace and punctuation ---- */
  function tokenize(text) {
    if (!text) return [];
    var tokens = [];
    var words = text.toLowerCase().split(/[\s　、。！？「」『』（）【】\-_,.]+/).filter(Boolean);
    tokens = tokens.concat(words);
    return tokens;
  }

  /* ---- Score: question > category > answer ---- */
  function score(item, queryTokens) {
    var q = (item.question || '').toLowerCase();
    var c = (item.category || '').toLowerCase();
    var a = (item.answer || '').toLowerCase();
    var total = 0;
    queryTokens.forEach(function (token) {
      if (!token) return;
      if (q.indexOf(token) !== -1) total += 10;
      if (c.indexOf(token) !== -1) total += 6;
      total += (a.split(token).length - 1) * 2;
    });
    return total;
  }

  /* ---- Escape HTML ---- */
  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---- Highlight matching tokens ---- */
  function highlight(text, queryTokens) {
    if (!text) return '';
    var safe = escapeHtml(text);
    var sorted = queryTokens.slice().sort(function (a, b) { return b.length - a.length; });
    sorted.forEach(function (token) {
      if (!token) return;
      var escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      safe = safe.replace(new RegExp('(' + escaped + ')', 'gi'), '<em>$1</em>');
    });
    return safe;
  }

  /* ---- Modal ---- */
  var modalOverlay = null;

  function ensureModal() {
    if (modalOverlay) return;
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'card-modal-overlay';
    modalOverlay.innerHTML =
      '<div class="card-modal">' +
        '<button class="card-modal-close" aria-label="Close">&#x2715;</button>' +
        '<div class="card-modal-meta"></div>' +
        '<div class="card-modal-question"></div>' +
        '<div class="card-modal-answer"></div>' +
      '</div>';
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
    modalOverlay.querySelector('.card-modal-close').addEventListener('click', closeModal);
    document.body.appendChild(modalOverlay);
  }

  function openModal(item) {
    ensureModal();
    modalOverlay.querySelector('.card-modal-meta').textContent = item.category || '';
    modalOverlay.querySelector('.card-modal-question').textContent = item.question || '';
    modalOverlay.querySelector('.card-modal-answer').textContent = item.answer || '';
    modalOverlay.classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* ---- Press duration detection (distinguish tap from text selection) ---- */
  var pressStart = 0;
  var pressItemIdx = -1;
  var CLICK_MAX_MS = 300;

  resultsContainer.addEventListener('pointerdown', function (e) {
    var item = e.target.closest('.search-result-item--expandable');
    if (!item) return;
    pressStart = Date.now();
    pressItemIdx = parseInt(item.dataset.idx, 10);
  });

  resultsContainer.addEventListener('pointerup', function (e) {
    if (pressStart === 0) return;
    var elapsed = Date.now() - pressStart;
    pressStart = 0;
    if (elapsed >= CLICK_MAX_MS) return;
    if (window.getSelection().toString().trim() !== '') return;
    var item = e.target.closest('.search-result-item--expandable');
    if (!item) return;
    var idx = parseInt(item.dataset.idx, 10);
    if (isNaN(idx) || idx !== pressItemIdx || !renderedItems[idx]) return;
    openModal(renderedItems[idx]);
  });

  resultsContainer.addEventListener('pointercancel', function () {
    pressStart = 0;
    pressItemIdx = -1;
  });

  /* ---- Mark cards whose answer overflows 2 lines as expandable ---- */
  function initExpandable() {
    resultsContainer.querySelectorAll('.search-result-item').forEach(function (itemEl) {
      var excerpt = itemEl.querySelector('.result-excerpt');
      if (!excerpt) return;
      if (excerpt.scrollHeight > excerpt.clientHeight + 2) {
        itemEl.classList.add('search-result-item--expandable');
      }
    });
  }

  /* ---- Render items ---- */
  function renderItems(items, queryTokens) {
    renderedItems = items;
    if (items.length === 0) {
      resultsContainer.innerHTML = '<p class="search-no-results">No matching questions found.</p>';
      return;
    }
    var hl = queryTokens && queryTokens.length > 0;
    var html = '';
    items.forEach(function (item, idx) {
      var question = escapeHtml(item.question);
      var answer   = hl ? highlight(item.answer, queryTokens) : escapeHtml(item.answer);
      html += '<div class="search-result-item" data-idx="' + idx + '">';
      html += '<div class="result-meta"><span class="tag tag-sm">' + escapeHtml(item.category) + '</span></div>';
      html += '<div class="result-title" style="font-weight:600;margin-top:0.4rem">' + question + '</div>';
      html += '<div class="result-excerpt">' + answer + '</div>';
      html += '</div>';
    });
    resultsContainer.innerHTML = html;
    initExpandable();
  }

  /* ---- Search handler ---- */
  function doSearch() {
    var query = searchInput.value.trim();
    if (query.length < 1) {
      renderItems(interviewData, []);
      return;
    }
    var queryTokens = tokenize(query);
    var filtered = interviewData
      .map(function (item) { return { item: item, score: score(item, queryTokens) }; })
      .filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (x) { return x.item; });
    renderItems(filtered, queryTokens);
  }

  /* ---- Event wiring ---- */
  var debounceTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSearch, 200);
  });

  renderItems(interviewData, []);
  searchInput.focus();
})();
