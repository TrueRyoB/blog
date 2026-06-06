/**
 * search.js
 * Client-side search using a pre-built search.json index.
 * Japanese-friendly: searches by character-level overlap in addition to word tokens.
 * No external dependencies.
 */
(function () {
  'use strict';

  var searchInput = document.getElementById('search-input');
  var resultsContainer = document.getElementById('search-results');

  if (!searchInput || !resultsContainer) return;

  var searchData = [];
  var loaded = false;

  /* ---- Load index ---- */
  function loadIndex(callback) {
    if (loaded) { callback(); return; }

    var baseurl = (document.querySelector('meta[name="baseurl"]') || {}).content || '';
    fetch(baseurl + '/search.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchData = data;
        loaded = true;
        callback();
      })
      .catch(function () {
        resultsContainer.innerHTML = '<p class="search-no-results">インデックスの読み込みに失敗しました。</p>';
      });
  }

  /* ---- Tokenize: split on whitespace + punctuation, also include n-grams for CJK ---- */
  function tokenize(text) {
    if (!text) return [];
    var tokens = [];

    // ASCII word tokens
    var words = text.toLowerCase().split(/[\s　、。！？「」『』（）【】\-_,.]+/).filter(Boolean);
    tokens = tokens.concat(words);

    // CJK bi-grams (for Japanese)
    var cjkOnly = text.replace(/[^　-鿿＀-￯]/g, '');
    for (var i = 0; i < cjkOnly.length - 1; i++) {
      tokens.push(cjkOnly.slice(i, i + 2));
    }
    // Also individual CJK characters
    for (var j = 0; j < cjkOnly.length; j++) {
      tokens.push(cjkOnly[j]);
    }

    return tokens;
  }

  /* ---- Score a single document against query tokens ---- */
  function score(doc, queryTokens) {
    var titleText = (doc.title || '').toLowerCase();
    var tagsText = ((doc.tags || []).join(' ')).toLowerCase();
    var excerptText = (doc.excerpt || '').toLowerCase();

    var total = 0;

    queryTokens.forEach(function (token) {
      if (!token) return;
      // Title matches score highest
      if (titleText.indexOf(token) !== -1) total += 10;
      // Tag matches
      if (tagsText.indexOf(token) !== -1) total += 6;
      // Excerpt matches
      var excerptCount = (excerptText.split(token).length - 1);
      total += excerptCount * 2;
    });

    return total;
  }

  /* ---- Highlight query tokens in text ---- */
  function highlight(text, queryTokens) {
    if (!text) return '';
    // Escape HTML
    var safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Sort tokens longest-first to avoid partial double-highlighting
    var sorted = queryTokens.slice().sort(function (a, b) { return b.length - a.length; });

    sorted.forEach(function (token) {
      if (!token || token.length < 1) return;
      // Case-insensitive replace
      var escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var re = new RegExp('(' + escaped + ')', 'gi');
      safe = safe.replace(re, '<em>$1</em>');
    });

    return safe;
  }

  /* ---- Build excerpt snippet around first match ---- */
  function makeExcerpt(text, queryTokens) {
    if (!text) return '';
    var lower = text.toLowerCase();
    var bestPos = text.length;

    queryTokens.forEach(function (token) {
      var pos = lower.indexOf(token);
      if (pos !== -1 && pos < bestPos) bestPos = pos;
    });

    var start = Math.max(0, bestPos - 60);
    var end = Math.min(text.length, bestPos + 160);
    var snippet = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    return highlight(snippet, queryTokens);
  }

  /* ---- Render results ---- */
  function renderResults(results, queryTokens) {
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="search-no-results">該当する記事が見つかりませんでした。</p>';
      return;
    }

    var html = '';
    results.forEach(function (doc) {
      var tagsHtml = '';
      if (doc.tags && doc.tags.length > 0) {
        tagsHtml = doc.tags.map(function (t) {
          return '<span class="tag tag-sm">' + t + '</span>';
        }).join(' ');
      }

      html += '<div class="search-result-item">';
      html += '<div class="result-title"><a href="' + doc.url + '">' + highlight(doc.title, queryTokens) + '</a></div>';
      html += '<div class="result-meta">' + doc.date + (tagsHtml ? ' &nbsp; ' + tagsHtml : '') + '</div>';
      html += '<div class="result-excerpt">' + makeExcerpt(doc.excerpt, queryTokens) + '</div>';
      html += '</div>';
    });

    resultsContainer.innerHTML = html;
  }

  /* ---- Main search handler ---- */
  function doSearch() {
    var query = searchInput.value.trim();

    if (query.length < 1) {
      resultsContainer.innerHTML = '<p class="search-hint">キーワードを入力してください。</p>';
      return;
    }

    var queryTokens = tokenize(query);

    // Score and filter
    var scored = searchData
      .map(function (doc) { return { doc: doc, score: score(doc, queryTokens) }; })
      .filter(function (item) { return item.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 20)
      .map(function (item) { return item.doc; });

    renderResults(scored, queryTokens);
  }

  /* ---- Event wiring ---- */
  var debounceTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      loadIndex(doSearch);
    }, 200);
  });

  // Trigger immediately if there's a ?q= parameter
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q');
  if (initialQuery) {
    searchInput.value = initialQuery;
    loadIndex(doSearch);
  } else {
    resultsContainer.innerHTML = '<p class="search-hint">キーワードを入力してください。</p>';
  }

  // Focus input
  searchInput.focus();
})();
