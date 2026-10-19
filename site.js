// Přepínač režimu (světlý/tmavý) a uložení volby jazyka. Výchozí stav nastavuje skript v <head>
// podle uložené volby, jinak podle prohlížeče a systému; tady se jen přepíná a ukládá.
// Jazyky jsou samostatné stránky (/ a /en/, generuje `npm run site`), přepínač jazyka jsou odkazy.

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

for (const link of document.querySelectorAll('[data-set-lang]')) {
  link.addEventListener('click', () => store('pauza.lang', link.dataset.setLang));
}

applyTheme();
