// Uso em desenvolvimento (Playwright MCP, browser_run_code_unsafe com "filename"):
// injeta os CSS da extensão na página atual e tira prints nos temas claro e escuro.
//
//   1. navegue até a tela desejada
//   2. (opcional) window.__sgName = 'portal'  -> nome usado nos arquivos
//   3. rode este arquivo
//
// Não faz parte da extensão: serve só para iterar no visual sem recarregar
// a extensão no navegador.
async (page) => {
  const dir = 'F:/Projetos/ext-sigaa/extensao-sigaa/src/styles/';
  const out = 'F:/Projetos/ext-sigaa/.playwright-mcp/';
  const files = [
    'tokens', 'base', 'shell', 'tables', 'forms', 'messages',
    'portal', 'caixa-postal', 'turma-virtual', 'turma-header', 'turma-mobile', 'reports', 'public', 'login', 'palette',
  ];
  const name = (await page.evaluate(() => window.__sgName)) || 'page';

  await page.evaluate(() => {
    document.querySelectorAll('style[data-sg-dev]').forEach((n) => n.remove());
  });
  for (const f of files) {
    const handle = await page.addStyleTag({ path: dir + f + '.css' });
    await handle.evaluate((n) => n.setAttribute('data-sg-dev', ''));
  }

  // Muda o tamanho da janela para o jQuery layout da Turma Virtual recalcular
  // os painéis (na extensão real o CSS entra antes do layout, aqui entra depois).
  await page.setViewportSize({ width: 1441, height: 900 });
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const theme of ['light', 'dark']) {
    await page.evaluate((t) => {
      const root = document.documentElement;
      root.dataset.sg = 'on';
      root.dataset.sgTheme = t;
      root.dataset.sgScheme = t;
    }, theme);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}t-${name}-${theme}.png`, fullPage: true });
  }
  return `ok: ${name}`;
}
