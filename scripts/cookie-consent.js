// Cookie consent + Google Analytics loader (GA4)
(function() {
  'use strict';

  var measurementId = 'G-M2FST5CGZH';
  var storageKey = 'bp-cookie-consent';
  var bannerId = 'cookie-banner';

  function getLang() {
    var lang = (document.documentElement.lang || '').toLowerCase();
    if (lang.startsWith('de')) {
      return 'de';
    }
    return 'en';
  }

  function applyLang(root) {
    var lang = getLang();
    root.querySelectorAll('[data-lang]').forEach(function(el) {
      var shouldHide = el.dataset.lang !== lang;
      el.hidden = shouldHide;
      el.style.display = shouldHide ? 'none' : '';
    });
  }

  function loadAnalytics() {
    if (window.__bpGaLoaded) {
      return;
    }
    window.__bpGaLoaded = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      anonymize_ip: true
    });
  }

  function getConsent() {
    try {
      return localStorage.getItem(storageKey);
    } catch (err) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(storageKey, value);
    } catch (err) {
      // Ignore storage failures (private mode, etc.)
    }
  }

  function removeBanner() {
    var existing = document.getElementById(bannerId);
    if (existing) {
      existing.remove();
    }
  }

  function showBanner() {
    if (document.getElementById(bannerId)) {
      return;
    }

    var banner = document.createElement('div');
    banner.id = bannerId;
    banner.className = 'cookie-banner';
    banner.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<p>' +
          '<span data-lang="de">Diese Website nutzt Cookies/ähnliche Technologien für Statistik (Google Analytics). Sie können zustimmen oder ablehnen. Mehr Infos in der <a href="/datenschutz/">Datenschutzerklärung</a>.</span>' +
          '<span data-lang="en" hidden>This website uses cookies/similar technologies for analytics (Google Analytics). You can accept or reject. More details in the <a href="/datenschutz/">Privacy Policy</a>.</span>' +
        '</p>' +
        '<div class="cookie-banner-actions">' +
          '<button class="cookie-button cookie-accept" type="button" data-consent="accept">' +
            '<span data-lang="de">Akzeptieren</span>' +
            '<span data-lang="en" hidden>Accept</span>' +
          '</button>' +
          '<button class="cookie-button cookie-reject" type="button" data-consent="reject">' +
            '<span data-lang="de">Ablehnen</span>' +
            '<span data-lang="en" hidden>Reject</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);
    applyLang(banner);

    banner.querySelector('[data-consent="accept"]').addEventListener('click', function() {
      setConsent('accepted');
      removeBanner();
      loadAnalytics();
    });

    banner.querySelector('[data-consent="reject"]').addEventListener('click', function() {
      setConsent('rejected');
      removeBanner();
    });
  }

  function init() {
    var consent = getConsent();
    if (consent === 'accepted') {
      loadAnalytics();
      return;
    }
    if (consent === 'rejected') {
      return;
    }
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
