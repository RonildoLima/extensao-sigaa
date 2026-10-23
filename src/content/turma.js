// Turma Virtual: pequenos acréscimos que o CSS sozinho não consegue fazer.
//
//  - viewport: o SIGAA não tem <meta name="viewport">, então o celular o
//    desenha como página de desktop e as media queries nunca disparam;
//  - faixa da turma: código, nome e detalhes da turma em destaque (o texto
//    vem dos próprios elementos do SIGAA, que continuam na página);
//  - avatar com as iniciais do usuário;
//  - botão "Buscar" (abre a busca Ctrl+K) na barra do sistema;
//  - botão ☰ e fundo escurecido da gaveta do menu lateral (celular).
//
// Só mexe em elementos novos e em classes do <html>; não toca em formulários,
// ids nem campos do SIGAA.
(() => {
  const layout = document.getElementById('baseLayout');
  if (!layout) return;

  const root = document.documentElement;
  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform ?? navigator.platform);

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const icon = (...shapes) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    for (const [tag, attrs] of shapes) {
      const shape = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const [key, value] of Object.entries(attrs)) shape.setAttribute(key, value);
      svg.append(shape);
    }
    return svg;
  };

  const text = (selector) => document.querySelector(selector)?.textContent.replace(/\s+/g, ' ').trim() ?? '';

  // ---------- Viewport ----------
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = el('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.append(meta);
  }

  // ---------- Faixa da turma ----------
  const buildTurma = () => {
    const wrapper = document.getElementById('nomeTurma');
    const name = text('#linkNomeTurma');
    if (!wrapper || !name) return;

    const code = text('#linkCodigoTurma').replace(/\s*-\s*$/, '');
    // "- T01 (2026.2)" -> "Turma T01 · 2026.2"
    const period = text('#linkPeriodoTurma').replace(/^\s*-\s*/, '');
    const parsed = period.match(/^(\S+)\s*\((.+)\)$/);
    // title: "2N12 3N1234 (08/09/2026 - 19/02/2027)" = horário e datas da turma
    const detail = document.getElementById('linkNomeTurma')?.title ?? '';
    const parsedDetail = detail.match(/^(.*?)\s*\((.+)\)$/);

    const meta = [
      parsed ? `Turma ${parsed[1]}` : period,
      parsed?.[2],
      parsedDetail?.[1] && `Horário ${parsedDetail[1]}`,
      parsedDetail?.[2] && parsedDetail[2].replace(/\s+-\s+/, ' a '),
    ]
      .filter(Boolean)
      .join(' · ');

    const banner = el('div', 'sg-turma');
    if (code) banner.append(el('span', 'sg-turma-code', code));
    const info = el('div', 'sg-turma-text');
    const title = el('div', 'sg-turma-name', name);
    title.title = name;
    info.append(title);
    if (meta) info.append(el('div', 'sg-turma-meta', meta));
    banner.append(info);

    wrapper.before(banner);
    root.classList.add('sg-turma-ready');
  };

  // ---------- Avatar ----------
  const buildAvatar = () => {
    const box = document.getElementById('painelDadosUsuario');
    const line = box?.querySelector('p');
    if (!box || !line || box.querySelector('.sg-avatar')) return;

    const clone = line.cloneNode(true);
    clone.querySelectorAll('a').forEach((a) => a.remove());
    const name = clone.textContent.replace(/\s+/g, ' ').trim();
    const words = name.split(' ').filter((w) => w.length > 2);
    const initials = (words.length > 1 ? words[0][0] + words.at(-1)[0] : (words[0] ?? name).slice(0, 2)).toUpperCase();

    const avatar = el('span', 'sg-avatar', initials);
    avatar.title = name;
    box.prepend(avatar);
  };

  // ---------- Botão Buscar ----------
  const buildSearch = () => {
    const dir = document.querySelector('#info-sistema .dir');
    if (!dir || dir.querySelector('.sg-bar-search')) return;

    const button = el('button', 'sg-bar-search');
    button.type = 'button';
    const shortcut = isMac ? '⌘ K' : 'Ctrl K';
    button.title = `Buscar no menu (${shortcut})`;
    button.setAttribute('aria-label', 'Buscar no menu');
    button.append(
      icon(['circle', { cx: 11, cy: 11, r: 7 }], ['path', { d: 'm20 20-3.5-3.5' }]),
      el('span', '', 'Buscar'),
      el('kbd', '', shortcut),
    );
    button.addEventListener('click', () => document.dispatchEvent(new CustomEvent('sg:open-palette')));
    dir.prepend(button);
  };

  // ---------- Gaveta do menu lateral (celular) ----------
  const buildNav = () => {
    const bar = document.getElementById('info-sistema');
    const menu = document.getElementById('barraEsquerda');
    if (!bar || !menu || bar.querySelector('.sg-nav-toggle')) return;

    const toggle = el('button', 'sg-nav-toggle');
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Menu da turma');
    toggle.setAttribute('aria-controls', 'barraEsquerda');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.append(icon(['path', { d: 'M4 7h16M4 12h16M4 17h16' }]));

    const backdrop = el('div', 'sg-nav-backdrop');
    backdrop.setAttribute('aria-hidden', 'true');

    const setOpen = (open) => {
      root.classList.toggle('sg-nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => setOpen(!root.classList.contains('sg-nav-open')));
    backdrop.addEventListener('click', () => setOpen(false));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && root.classList.contains('sg-nav-open')) setOpen(false);
    });
    // Ao voltar para a janela larga a gaveta vira a coluna normal: não deixa o estado "aberto" preso.
    window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });

    bar.prepend(toggle);
    document.body.append(backdrop);
  };

  buildTurma();
  buildAvatar();
  buildSearch();
  buildNav();
})();
