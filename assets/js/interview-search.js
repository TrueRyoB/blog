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
    resultsContainer.innerHTML = '<p class="search-no-results">データの読み込みに失敗しました。</p>';
    return;
  }

  /* ---- Tokenize: whitespace/punct split + CJK bi-grams ---- */
  function tokenize(text) {
    if (!text) return [];
    var tokens = [];
    var words = text.toLowerCase().split(/[\s　、。！？「」『』（）【】\-_,.]+/).filter(Boolean);
    tokens = tokens.concat(words);
    var cjkOnly = text.replace(/[^　-鿿＀-￯]/g, '');
    for (var i = 0; i < cjkOnly.length - 1; i++) {
      tokens.push(cjkOnly.slice(i, i + 2));
    }
    for (var j = 0; j < cjkOnly.length; j++) {
      tokens.push(cjkOnly[j]);
    }
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

  /* ---- Render items ---- */
  function renderItems(items, queryTokens) {
    if (items.length === 0) {
      resultsContainer.innerHTML = '<p class="search-no-results">該当する質問が見つかりませんでした。</p>';
      return;
    }
    var hl = queryTokens && queryTokens.length > 0;
    var html = '';
    items.forEach(function (item) {
      var question = escapeHtml(item.question);
      var answer   = hl ? highlight(item.answer,   queryTokens) : escapeHtml(item.answer);
      html += '<div class="search-result-item">';
      html += '<div class="result-meta"><span class="tag tag-sm">' + escapeHtml(item.category) + '</span></div>';
      html += '<div class="result-title" style="font-weight:600;margin-top:0.4rem">' + question + '</div>';
      html += '<div class="result-excerpt" style="white-space:pre-wrap">' + answer + '</div>';
      html += '</div>';
    });
    resultsContainer.innerHTML = html;
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
