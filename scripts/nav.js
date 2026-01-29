(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) {
    return;
  }

  function setExpanded(isOpen) {
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', isOpen);
  }

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setExpanded(!isOpen);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 720) {
      setExpanded(false);
    }
  });
})();
