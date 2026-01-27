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
  document.querySelectorAll("[data-lang]").forEach((el) => {
    const shouldHide = el.dataset.lang !== lang;
    el.hidden = shouldHide;
    el.style.display = shouldHide ? "none" : "";
  });
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.lang === lang);
  });
}

window.setLanguage = setLanguage;

function initLanguageToggle() {
  setLanguage(getInitialLang());
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-lang-toggle]");
    if (!btn) {
      return;
    }
    setLanguage(btn.dataset.lang);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanguageToggle);
} else {
  initLanguageToggle();
}
