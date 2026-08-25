(function () {
  'use strict';

  var toggle   = document.getElementById('nav-toggle');
  var menu     = document.getElementById('nav-mobile-menu');
  var backdrop = document.getElementById('nav-backdrop');

  if (!toggle || !menu || !backdrop) return;

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('is-open');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }

  toggle.addEventListener('click', function () {
    if (toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.style.transition = 'none';
      backdrop.style.transition = 'none';
      closeMenu();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 640 && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
})();
