// Detect browser language and show appropriate content
// German for de-*, English for everything else
(function() {
  'use strict';

  function getBrowserLang() {
    var browser = (navigator.language || '').toLowerCase();
    // German for any German locale (de, de-DE, de-AT, de-CH, etc.)
    if (browser.startsWith('de')) {
      return 'de';
    }
    return 'en';
  }

  function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach(function(el) {
      var shouldHide = el.dataset.lang !== lang;
      el.hidden = shouldHide;
      el.style.display = shouldHide ? 'none' : '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setLanguage(getBrowserLang());
    });
  } else {
    setLanguage(getBrowserLang());
  }
})();
