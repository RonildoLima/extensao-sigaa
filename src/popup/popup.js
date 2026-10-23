// Popup: liga/desliga o tema e escolhe claro/escuro/automático.
// As abas do SIGAA reagem sozinhas via chrome.storage.onChanged (early.js).
const DEFAULTS = { enabled: true, theme: 'auto' };

const enabledInput = document.getElementById('enabled');
const themeGroup = document.getElementById('temas');
const themeInputs = document.querySelectorAll('input[name="theme"]');

const render = (prefs) => {
  enabledInput.checked = prefs.enabled;
  themeGroup.disabled = !prefs.enabled;
  themeInputs.forEach((input) => {
    input.checked = input.value === prefs.theme;
  });
};

enabledInput.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: enabledInput.checked });
  themeGroup.disabled = !enabledInput.checked;
});

themeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) chrome.storage.sync.set({ theme: input.value });
  });
});

document.getElementById('versao').textContent =
  `Versão ${chrome.runtime.getManifest().version}`;

chrome.storage.sync.get(DEFAULTS).then(render);
