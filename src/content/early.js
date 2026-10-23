// Roda em document_start: aplica as preferências antes da primeira pintura
// para a página não "piscar" no visual antigo.
//
// O localStorage da própria página serve de espelho síncrono; a fonte da
// verdade é o chrome.storage.sync (alterado pelo popup).
//
// Atributos que o CSS usa no <html>:
//   data-sg        "on" | "off"                  tema ligado ou desligado
//   data-sg-theme  "auto" | "light" | "dark"     escolha do usuário
//   data-sg-scheme "light" | "dark"              esquema efetivo (resolve o "auto")
(() => {
  const root = document.documentElement;
  const MIRROR_KEY = 'sg-prefs';
  const DEFAULTS = { enabled: true, theme: 'auto' };
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  let current = { ...DEFAULTS };

  const apply = (prefs) => {
    current = prefs;
    root.dataset.sg = prefs.enabled ? 'on' : 'off';
    root.dataset.sgTheme = prefs.theme;
    root.dataset.sgScheme =
      prefs.theme === 'auto' ? (prefersDark.matches ? 'dark' : 'light') : prefs.theme;
  };

  const readMirror = () => {
    try {
      return JSON.parse(localStorage.getItem(MIRROR_KEY)) || {};
    } catch {
      return {};
    }
  };

  const writeMirror = (prefs) => {
    try {
      localStorage.setItem(MIRROR_KEY, JSON.stringify(prefs));
    } catch {
      // localStorage indisponível: o chrome.storage continua valendo.
    }
  };

  const sync = () =>
    chrome.storage.sync.get(DEFAULTS).then((prefs) => {
      apply(prefs);
      writeMirror(prefs);
    });

  apply({ ...DEFAULTS, ...readMirror() });
  sync();

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') sync();
  });

  // Tema "auto" acompanha o sistema operacional em tempo real.
  prefersDark.addEventListener('change', () => apply(current));
})();
