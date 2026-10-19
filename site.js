// Přepínač jazyka (CS/EN) a režimu (světlý/tmavý). Výchozí stav nastavuje skript v <head>
// podle uložené volby, jinak podle prohlížeče a systému; tady se jen přepíná a ukládá.

const root = document.documentElement;
const systemDark = matchMedia('(prefers-color-scheme: dark)');

function store(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // soukromé okno apod. – volba platí jen do zavření stránky
  }
}

// ---------- režim ----------

/** Tmavé screeny (<source>) a barva lišty prohlížeče (<meta theme-color>) podle zvoleného režimu. */
function applyTheme() {
  const theme = root.dataset.theme; // chybí = podle systému
  for (const el of document.querySelectorAll('[data-scheme]')) {
    el.media = theme ? (el.dataset.scheme === theme ? 'all' : 'not all') : `(prefers-color-scheme: ${el.dataset.scheme})`;
  }
}

document.querySelector('.theme').addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches;
  const next = dark ? 'light' : 'dark';
  // volba shodná se systémem = zase podle systému (přepne se sama, až se systém změní)
  if (next === (systemDark.matches ? 'dark' : 'light')) {
    delete root.dataset.theme;
    store('pauza.theme', null);
  } else {
    root.dataset.theme = next;
    store('pauza.theme', next);
  }
  applyTheme();
});

// ---------- jazyk ----------

const title = document.querySelector('title');
const titleCs = title.textContent;

function applyLang() {
  const lang = root.lang;
  title.textContent = lang === 'en' ? title.dataset.en : titleCs;
  for (const img of document.querySelectorAll('img[data-alt-en]')) {
    img.dataset.altCs ??= img.alt;
    img.alt = lang === 'en' ? img.dataset.altEn : img.dataset.altCs;
  }
  for (const el of document.querySelectorAll('picture source, picture img')) {
    const attr = el.tagName === 'SOURCE' ? 'srcset' : 'src';
    el.setAttribute(attr, el.getAttribute(attr).replace(/img\/(cs|en)\//, `img/${lang}/`));
  }
  for (const btn of document.querySelectorAll('[data-set-lang]')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.setLang === lang));
  }
}

for (const btn of document.querySelectorAll('[data-set-lang]')) {
  btn.addEventListener('click', () => {
    root.lang = btn.dataset.setLang;
    store('pauza.lang', root.lang);
    applyLang();
  });
}

applyTheme();
applyLang();
