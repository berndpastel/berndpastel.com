const supportedLangs = ["de", "en"];

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    // ignore storage errors (file:// or privacy mode)
  }
}

function getInitialLang() {
  var params = new URLSearchParams(window.location.search || "");
  var paramLang = params.get("lang");
  if (paramLang && supportedLangs.includes(paramLang)) {
    safeStorageSet("lang", paramLang);
    return paramLang;
  }
  const stored = safeStorageGet("lang");
  if (stored && supportedLangs.includes(stored)) {
    return stored;
  }
  const browser = (navigator.language || "").toLowerCase();
  if (browser.startsWith("en")) {
    return "en";
  }
  return "de";
}

function setLanguage(lang) {
  if (!supportedLangs.includes(lang)) {
    return;
  }
  document.documentElement.lang = lang;
  safeStorageSet("lang", lang);
  updateLangUrl(lang);
  updateLangLinks(lang);
  document.querySelectorAll("[data-lang]").forEach((el) => {
    const shouldHide = el.dataset.lang !== lang;
    el.hidden = shouldHide;
    el.style.display = shouldHide ? "none" : "";
  });
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    var isCurrent = btn.dataset.langToggle === lang;
    btn.setAttribute("aria-pressed", isCurrent);
    btn.hidden = isCurrent;
    btn.style.display = isCurrent ? "none" : "";
  });
}

window.setLanguage = setLanguage;

function updateLangLinks(lang) {
  document.querySelectorAll("a[href]").forEach((link) => {
    var href = link.getAttribute("href");
    if (!href) {
      return;
    }
    var lower = href.toLowerCase();
    if (
      lower.startsWith("#") ||
      lower.startsWith("mailto:") ||
      lower.startsWith("tel:") ||
      lower.startsWith("javascript:")
    ) {
      return;
    }
    if (lower.startsWith("http://") || lower.startsWith("https://")) {
      try {
        var url = new URL(href);
        if (url.origin !== window.location.origin) {
          return;
        }
      } catch (err) {
        return;
      }
    }
    var hashIndex = href.indexOf("#");
    var hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
    var pathAndQuery = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
    var queryIndex = pathAndQuery.indexOf("?");
    var path = queryIndex >= 0 ? pathAndQuery.slice(0, queryIndex) : pathAndQuery;
    var query = queryIndex >= 0 ? pathAndQuery.slice(queryIndex + 1) : "";
    var params = new URLSearchParams(query);
    params.set("lang", lang);
    link.setAttribute("href", path + "?" + params.toString() + hash);
  });
}

function updateLangUrl(lang) {
  var url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url.toString());
}

function initLanguageToggle() {
  setLanguage(getInitialLang());
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-lang-toggle]");
    if (!btn) {
      return;
    }
    setLanguage(btn.dataset.langToggle);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanguageToggle);
} else {
  initLanguageToggle();
}
