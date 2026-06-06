/**
 * dark-mode.js
 * Handles dark/light theme toggle with localStorage persistence.
 * The initial theme is applied inline in <head> to avoid FOUC.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var DARK = 'dark';
  var LIGHT = 'light';

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === DARK ? DARK : LIGHT;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggleTheme() {
    var current = getCurrentTheme();
    applyTheme(current === DARK ? LIGHT : DARK);
  }

  // Wire up the button once the DOM is ready
  function init() {
    var btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;
    btn.addEventListener('click', toggleTheme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Listen for OS-level preference changes (only if user hasn't overridden)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? DARK : LIGHT);
    }
  });
})();
