// Roda no mundo MAIN da página (declarado no manifest com "world": "MAIN").
//
// A Turma Virtual monta o layout com o plugin jQuery layout e fixa o painel
// norte em 48px. A barra superior do tema (turma-header.css) é maior e declara
// a altura que quer em --sg-turma-header-h; aqui pedimos ao plugin essa altura
// com a própria API (sizePane), e ele reposiciona os outros painéis. Sem o
// tema (ou com Alto contraste), a variável não existe e volta para 48px.
//
// Não altera dados nem chama nada do SIGAA além do layout.
(() => {
  const ORIGINAL = 48;
  if (!document.getElementById('baseLayout')) return;

  const layoutOf = () => {
    try {
      const jq = window.J || window.jQuery;
      return jq('#baseLayout').data('layout') || null;
    } catch {
      return null;
    }
  };

  const wantedSize = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--sg-turma-header-h');
    const px = parseFloat(raw);
    return Number.isFinite(px) ? px : ORIGINAL;
  };

  const apply = () => {
    const layout = layoutOf();
    if (!layout?.state?.north) return false;
    const size = wantedSize();
    if (layout.state.north.size !== size) layout.sizePane('north', size);
    return true;
  };

  // O plugin é iniciado pelo script da própria página; espera ele existir.
  const waitForLayout = (tries = 0) => {
    if (!apply() && tries < 100) setTimeout(() => waitForLayout(tries + 1), 50);
  };
  waitForLayout();

  // Tema ligado/desligado pelo popup, Alto contraste e media queries (celular) mudam a variável.
  new MutationObserver(apply).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-sg', 'class'],
  });
  window.addEventListener('resize', apply);
})();
