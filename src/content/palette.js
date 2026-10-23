// Busca no menu (Ctrl+K).
//
// O menu do SIGAA (jsCookMenu) só existe no Portal do Discente e esconde mais
// de cem itens em submenus que abrem ao passar o mouse. Aqui ele vira uma
// paleta de busca que abre com Ctrl+K (⌘K no Mac) em qualquer tela logada.
//
// De onde vêm os itens:
//  - menu-bridge.js (mundo MAIN) publica o array do menu em #sg-menu-data.
//  - No portal usamos esse menu "ao vivo" e guardamos uma cópia em
//    chrome.storage.local (só rótulos e ações do menu, nada pessoal).
//  - Nas outras telas, que não têm o menu, usamos a cópia: escolher um item
//    abre o Menu Discente e dispara o item lá (o pedido fica poucos segundos
//    no sessionStorage).
//
// Como um item é aberto: o jsCookMenu preenche o campo oculto `jscook_action`
// do formulário do menu e dá submit. Fazemos exatamente isso, sem tocar em
// ViewState nem em nenhum outro campo.
(() => {
  const root = document.documentElement;
  const DATA_ID = 'sg-menu-data';
  const CACHE_KEY = 'menuCache';
  const PENDING_KEY = 'sg-menu-pending';
  const PENDING_TTL = 30_000;
  const PORTAL_FALLBACK = '/sigaa/verPortalDiscente.do';
  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform ?? navigator.platform);
  const SHORTCUT = isMac ? '⌘ K' : 'Ctrl K';

  // ---------- Dados do menu ----------

  const decoder = document.createElement('textarea');
  // Os rótulos vêm com entidades HTML ("Matr&#237;cula"); a textarea decodifica sem interpretar tags.
  const decode = (html) => {
    decoder.innerHTML = html;
    return decoder.value.trim();
  };

  // Minúsculas e sem acento, mantendo o mesmo comprimento para os índices
  // da busca valerem no texto original (usado no destaque).
  const fold = (text) =>
    text.replace(/./gsu, (ch) => {
      const folded = ch.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
      return folded.length === ch.length ? folded : ch;
    });

  const URL_ACTION = /^\w*:A\]\w*:\/\//;
  const SCRIPT_ACTION = /^\w*:A\]\w*:/;

  // Item do jsCookMenu: [ícone, rótulo, ação, formulário, dica, ...filhos]; separadores são {}.
  const flatten = (menu) => {
    const out = [];
    const walk = (nodes, trail) => {
      for (const node of nodes) {
        if (!Array.isArray(node)) continue;
        const [, rawLabel, action, target, , ...children] = node;
        const label = decode(String(rawLabel ?? ''));
        if (!label) continue;
        const path = [...trail, label];
        if (children.length) walk(children, path);
        else if (typeof action !== 'string') continue;
        else if (URL_ACTION.test(action)) out.push({ path, url: action.replace(/^\w*:A\]/, '') });
        // Ação em JavaScript o próprio menu roda com eval; não repetimos isso aqui.
        else if (!SCRIPT_ACTION.test(action)) out.push({ path, action, target });
      }
    };
    walk(menu, []);
    return out;
  };

  const prepare = (items) =>
    items.map((item, index) => {
      const name = item.path.at(-1);
      const trail = item.path.slice(0, -1);
      return { ...item, index, name, trail, foldName: fold(name), foldTrail: fold(trail.join(' ')) };
    });

  // ---------- Estado ----------

  const state = { items: [], live: false, portalUrl: null };

  const sameOriginUrl = (href) => {
    try {
      const url = new URL(href, location.href);
      return url.origin === location.origin ? url.href : null;
    } catch {
      return null;
    }
  };

  const portalHref = () => {
    const link = document.querySelector('#menu-usuario .menus a[href]');
    return (
      (link && sameOriginUrl(link.getAttribute('href'))) ||
      state.portalUrl ||
      sameOriginUrl(PORTAL_FALLBACK)
    );
  };

  const saveCache = (items) => {
    try {
      const plain = items.map(({ path, action, target, url }) => ({ path, action, target, url }));
      chrome.storage.local
        .set({ [CACHE_KEY]: { savedAt: Date.now(), portalUrl: portalHref(), items: plain } })
        .catch(() => {});
    } catch {
      // Extensão recarregada com a aba aberta: sem cache até recarregar a página.
    }
  };

  const loadCache = async () => {
    try {
      const { [CACHE_KEY]: cache } = await chrome.storage.local.get(CACHE_KEY);
      if (!state.live && Array.isArray(cache?.items)) {
        state.items = prepare(cache.items);
        state.portalUrl = sameOriginUrl(cache.portalUrl);
      }
    } catch {
      // Sem cache.
    }
  };

  const takePending = () => {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      if (!raw) return null;
      sessionStorage.removeItem(PENDING_KEY);
      const pending = JSON.parse(raw);
      return Date.now() - pending.at < PENDING_TTL ? pending : null;
    } catch {
      return null;
    }
  };

  const savePending = ({ action, target }) => {
    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify({ action, target, at: Date.now() }));
    } catch {
      // Sem sessionStorage: o item não abre sozinho depois do portal.
    }
  };

  // ---------- Abrir um item ----------

  // Mesmo caminho do cmItemMouseUp do jsCookMenu para ações JSF.
  const submitMenuAction = (action, target) => {
    const form = document.forms[target];
    const field = form?.elements['jscook_action'];
    if (!field) return false;
    field.value = action;
    form.submit();
    return true;
  };

  const openItem = (item) => {
    if (item.url) {
      try {
        const url = new URL(item.url, location.href);
        if (/^https?:$/.test(url.protocol)) window.open(url.href, '_blank', 'noopener');
        return true;
      } catch {
        return false;
      }
    }
    if (state.live) return submitMenuAction(item.action, item.target);
    const portal = portalHref();
    if (!portal) return false;
    savePending(item);
    location.assign(portal);
    return true;
  };

  // ---------- Busca ----------

  const tokenize = (query) => fold(query).split(/\s+/).filter(Boolean);

  const atWordStart = (text, at) => at === 0 || !/[\p{L}\p{N}]/u.test(text[at - 1]);

  // -1 = não casa; quanto maior, melhor. Todos os termos precisam aparecer.
  const score = (item, tokens) => {
    let total = 0;
    for (const token of tokens) {
      const inName = item.foldName.indexOf(token);
      if (inName >= 0) total += (atWordStart(item.foldName, inName) ? 100 : 60) + (inName === 0 ? 20 : 0);
      else if (item.foldTrail.includes(token)) total += 10;
      else return -1;
    }
    return total - item.name.length / 100;
  };

  const highlight = (item, tokens) => {
    const ranges = [];
    for (const token of tokens) {
      const at = item.foldName.indexOf(token);
      if (at >= 0) ranges.push([at, at + token.length]);
    }
    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const range of ranges) {
      const last = merged.at(-1);
      if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
      else merged.push([...range]);
    }
    const nodes = [];
    let pos = 0;
    for (const [from, to] of merged) {
      if (from > pos) nodes.push(item.name.slice(pos, from));
      const mark = document.createElement('mark');
      mark.textContent = item.name.slice(from, to);
      nodes.push(mark);
      pos = to;
    }
    if (pos < item.name.length) nodes.push(item.name.slice(pos));
    return nodes;
  };

  // ---------- Interface ----------

  let dialog, input, list, empty, announcer, note;
  let matches = [];
  let options = [];
  let active = -1;

  const build = () => {
    dialog = document.createElement('dialog');
    dialog.id = 'sg-palette';
    dialog.setAttribute('aria-label', 'Buscar no menu');
    // Marcação estática da extensão: nenhum dado da página passa por aqui.
    dialog.innerHTML = `
      <div class="sg-pal-field">
        <svg class="sg-pal-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input id="sg-pal-input" type="text" role="combobox" aria-expanded="true" aria-controls="sg-pal-list"
          aria-autocomplete="list" aria-label="Buscar no menu" placeholder="Buscar no menu: histórico, notas, matrícula…"
          autocomplete="off" autocapitalize="off" spellcheck="false">
        <kbd>Esc</kbd>
      </div>
      <ul id="sg-pal-list" role="listbox" aria-label="Itens do menu"></ul>
      <div class="sg-pal-empty" hidden></div>
      <div class="sg-pal-foot">
        <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
        <span><kbd>Enter</kbd> abrir</span>
        <span class="sg-pal-note"></span>
      </div>
      <div class="sg-pal-announcer" role="status" aria-live="polite"></div>`;
    document.body.append(dialog);

    input = dialog.querySelector('#sg-pal-input');
    list = dialog.querySelector('#sg-pal-list');
    empty = dialog.querySelector('.sg-pal-empty');
    announcer = dialog.querySelector('.sg-pal-announcer');
    note = dialog.querySelector('.sg-pal-note');

    input.addEventListener('input', render);
    input.addEventListener('keydown', onInputKey);

    // Mantém o foco no campo ao clicar na lista.
    list.addEventListener('mousedown', (event) => event.preventDefault());
    list.addEventListener('mousemove', (event) => {
      // O Chrome emite mousemove sem movimento quando a lista aparece sob o cursor parado.
      if (!event.movementX && !event.movementY) return;
      const index = optionIndex(event.target);
      if (index >= 0 && index !== active) setActive(index, false);
    });
    list.addEventListener('click', (event) => {
      const index = optionIndex(event.target);
      if (index >= 0) choose(matches[index]);
    });
    // Clique no fundo escurecido: o alvo é o próprio <dialog>.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  };

  const optionIndex = (el) => {
    const option = el.closest?.('[role="option"]');
    return option ? Number(option.dataset.index) : -1;
  };

  const setActive = (index, scroll = true) => {
    if (!options.length) {
      active = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    options[active]?.setAttribute('aria-selected', 'false');
    active = (index + options.length) % options.length;
    const option = options[active];
    option.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', option.id);
    if (scroll) option.scrollIntoView({ block: 'nearest' });
  };

  const render = () => {
    const tokens = tokenize(input.value);
    matches = tokens.length
      ? state.items
          .map((item) => ({ item, points: score(item, tokens) }))
          .filter(({ points }) => points >= 0)
          .sort((a, b) => b.points - a.points || a.item.index - b.item.index)
          .map(({ item }) => item)
      : state.items;

    list.replaceChildren();
    options = [];
    active = -1;

    let section = null;
    matches.forEach((item, index) => {
      // Sem busca, a lista segue a ordem do menu com o título de cada seção.
      if (!tokens.length && item.path[0] !== section) {
        section = item.path[0];
        const heading = document.createElement('li');
        heading.className = 'sg-pal-group';
        heading.setAttribute('role', 'presentation');
        heading.textContent = section;
        list.append(heading);
      }

      const option = document.createElement('li');
      option.id = `sg-pal-opt-${index}`;
      option.className = 'sg-pal-opt';
      option.dataset.index = index;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');

      const name = document.createElement('span');
      name.className = 'sg-pal-name';
      name.append(...highlight(item, tokens));
      option.append(name);

      const trail = (tokens.length ? item.trail : item.trail.slice(1)).join(' › ');
      if (trail) {
        const where = document.createElement('span');
        where.className = 'sg-pal-trail';
        where.textContent = trail;
        option.append(where);
      }
      if (item.url) {
        option.dataset.external = '';
        option.title = 'Abre em uma nova aba';
      }
      list.append(option);
      options.push(option);
    });

    renderMessage(tokens.length > 0);
    announcer.textContent = matches.length === 1 ? '1 resultado' : `${matches.length} resultados`;
    note.textContent = state.items.length && !state.live ? 'Abre passando pelo Menu Discente' : '';
    setActive(0);
  };

  const renderMessage = (searching) => {
    empty.replaceChildren();
    empty.hidden = matches.length > 0;
    if (matches.length) return;

    if (searching) {
      empty.textContent = `Nada encontrado para “${input.value.trim()}”.`;
      return;
    }
    const portal = portalHref();
    empty.append('Ainda não conheço o menu. Abra o Menu Discente uma vez e a busca passa a funcionar em todas as telas.');
    if (portal) {
      const link = document.createElement('a');
      link.href = portal;
      link.textContent = 'Abrir Menu Discente';
      empty.append(link);
    }
  };

  const choose = (item) => {
    if (!item) return;
    if (openItem(item)) dialog.close();
    // Raro: o formulário do menu sumiu. Avisa em vez de falhar calado.
    else note.textContent = 'Não consegui abrir este item. Abra o Menu Discente e tente de novo.';
  };

  const onInputKey = (event) => {
    if (event.isComposing) return;
    switch (event.key) {
      case 'ArrowDown':
        setActive(active + 1);
        break;
      case 'ArrowUp':
        setActive(active - 1);
        break;
      case 'Enter':
        choose(matches[active]);
        break;
      case 'Tab':
        break;
      default:
        return;
    }
    // Não deixa o SIGAA nem o navegador reagirem a essas teclas.
    event.preventDefault();
    event.stopPropagation();
  };

  let cacheReady = Promise.resolve();

  const open = async () => {
    if (!dialog) build();
    if (!dialog.open) {
      input.value = '';
      dialog.showModal();
    }
    input.focus();
    await cacheReady;
    render();
  };

  // ---------- Atalho e botão ----------

  const themeActive = () => root.dataset.sg === 'on' && !root.classList.contains('contrast');

  document.addEventListener(
    'keydown',
    (event) => {
      const mod = isMac ? event.metaKey : event.ctrlKey;
      if (!mod || event.altKey || event.shiftKey || event.repeat) return;
      // O preenchimento automático do Chrome dispara keydown sem `key`.
      if (event.code !== 'KeyK' && event.key?.toLowerCase() !== 'k') return;
      if (event.target.isContentEditable || !themeActive()) return;
      event.preventDefault();
      event.stopPropagation();
      if (dialog?.open) dialog.close();
      else open();
    },
    true,
  );

  // Outros scripts da extensão (ex.: o botão da Turma Virtual) pedem a paleta por evento.
  document.addEventListener('sg:open-palette', () => {
    if (themeActive()) open();
  });

  // Botão "Buscar" no painel do usuário, ao lado de Módulos, Caixa Postal etc.
  const addButton = () => {
    const menu = document.querySelector('#menu-usuario ul');
    if (!menu || menu.querySelector('.sg-busca')) return;
    const item = document.createElement('li');
    item.className = 'sg-busca';
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('role', 'button');
    link.title = `Buscar no menu (${SHORTCUT})`;
    const hint = document.createElement('kbd');
    hint.textContent = SHORTCUT;
    link.append('Buscar', hint);
    link.addEventListener('click', (event) => {
      event.preventDefault();
      open();
    });
    item.append(link);
    menu.prepend(item);
  };

  // ---------- Início ----------

  // Sempre consome o pedido: um pedido velho nunca dispara numa visita posterior.
  const pending = takePending();

  const adoptLive = () => {
    const node = document.getElementById(DATA_ID);
    if (!node || state.live) return;
    let items;
    try {
      items = flatten(JSON.parse(node.textContent));
    } catch {
      return;
    }
    if (!items.length) return;

    state.items = prepare(items);
    state.live = true;
    state.portalUrl = portalHref();
    saveCache(state.items);

    // Só dispara itens que existem de fato no menu desta página.
    const wanted = pending && state.items.find((i) => i.action === pending.action && i.target === pending.target);
    if (wanted) openItem(wanted);
  };

  addButton();
  adoptLive();
  if (!state.live) {
    document.addEventListener('sg:menu-ready', adoptLive, { once: true });
    cacheReady = loadCache();
  }
})();
