# AGENTS.md

Guia para agentes de IA (Claude Code, Codex, Cursor, Copilot...) que vão mexer neste projeto. Quem escreve é gente que quer **personalizar o visual do SIGAA**, nem sempre programadora: fale em português simples e mostre o resultado, não só o código.

**SIGAA Moderno** é uma extensão de navegador (Manifest V3, CSS e JS puros, **sem build, sem dependências**) que moderniza o SIGAA da UFCG com tema claro e escuro e busca no menu (Ctrl+K). O [README.md](README.md) tem os detalhes ("Como funciona" e "Particularidades do SIGAA"); leia antes de mudar algo além de cores.

## Por onde começar

1. Descubra o que a pessoa quer mudar. Se o pedido for vago ("deixe mais bonito"), pergunte com opções curtas, uma pergunta por vez: cores, fonte e tamanhos, uma tela específica, a busca Ctrl+K ou um recurso novo.
2. Ache o arquivo pelo mapa abaixo e leia o comentário do topo dele.
3. Mude o **mínimo necessário**. Mudança de cor ou de espaçamento quase sempre é uma linha.
4. Diga em português simples o que mudou e como ver: em `chrome://extensions`, **Recarregar** na extensão e F5 na aba do SIGAA (o CSS só entra quando a página carrega).
5. Se a pessoa gostar, ofereça o commit. Se não, `git restore .` desfaz o que não foi commitado.

## Mapa: o que mudar → onde

| Quero mudar | Arquivo |
| --- | --- |
| Cores, fonte, raios, sombras (vale para tudo) | `src/styles/tokens.css`: variáveis `--sg-*`, claro e escuro juntos com `light-dark(claro, escuro)` |
| Títulos, links, tipografia geral | `src/styles/base.css` |
| Cabeçalho, painel do usuário, menu dropdown, rodapé, janela de Módulos | `src/styles/shell.css` |
| Tabelas (listagens, notas) | `src/styles/tables.css` |
| Campos e botões | `src/styles/forms.css` |
| Mensagens de sucesso, aviso e erro | `src/styles/messages.css` |
| Portal do discente | `src/styles/portal.css` |
| Turma Virtual: cores e texto, barra superior, celular | `turma-virtual.css`, `turma-header.css`, `turma-mobile.css` e `src/content/turma.js` |
| Relatórios (notas, índices, histórico) | `src/styles/reports.css` |
| Login, portal público, Caixa Postal | `login.css`, `public.css`, `caixa-postal.css` |
| Busca Ctrl+K (visual, atalho, comportamento) | `src/styles/palette.css` e `src/content/palette.js` |
| Popup do ícone da extensão | `src/popup/` (`popup.html`, `popup.css`, `popup.js`) |
| Tema claro/escuro/automático e preferências | `src/content/early.js` |

Arquivo novo (CSS ou JS) só vale depois de entrar no `manifest.json`. CSS novo também entra na lista de `scripts/preview.js`. A **ordem** do `css` no manifest importa: depois do `tokens.css`, do geral para o específico.

## Regras do código (não quebre)

- **Todo CSS fica dentro de** `html[data-sg="on"]:not(.contrast) { ... }` (CSS aninhado). É isso que liga e desliga o tema pelo popup, vence o CSS do SIGAA e respeita o **Alto contraste** nativo (`html.contrast`).
- **Cores só por token** (`var(--sg-...)`), nunca hexadecimal solto. Cor nova entra em `tokens.css` com os dois valores, `light-dark(claro, escuro)`.
- **Nunca use `j_id_jsp_*`, `j_id*` nem hashes de bundle como seletor:** mudam a cada deploy do SIGAA. A URL **não identifica** a tela (quase tudo é `discente.jsf` ou `turmas.jsf`): reconheça pelo DOM (`#baseLayout`, `form[name="loginForm"]`...).
- O SIGAA usa muito `#id` nos seletores: a regra nova precisa repetir o `#id` para vencer.
- **Estilo inline do SIGAA só cede com `!important`.** Use quando preciso e comente o motivo na linha.
- **Não fixe `font-size` em `#conteudo`:** os botões A+ e A- do SIGAA mexem nele.
- **Turma Virtual:** o jQuery layout calcula as dimensões dos painéis. Só cor, borda e tipografia; para tamanho de painel, use a variável `--sg-turma-header-h` (ver README). O espaço entre seções do menu lateral é `padding`, nunca `margin` (a sanfona do RichFaces quebra).
- **Login:** não mude `name`, `id` nem `onclick` dos campos, para o preenchimento automático do navegador continuar funcionando.
- **JS nunca grava nem altera dados do SIGAA.** A busca só faz o que o clique no menu faria (`jscook_action` + `submit`), sem tocar em `ViewState`. Sem `eval`. Texto vindo da página entra no DOM com `textContent`, nunca com `innerHTML` (os dois `innerHTML` de `palette.js` são marcação estática da extensão e uma `<textarea>` que só decodifica entidades).
- **Mundo da página:** content scripts comuns não enxergam variáveis do SIGAA. Para ler uma, use um script `"world": "MAIN"` que publique o dado no DOM (veja `menu-bridge.js`). O Prototype.js do SIGAA quebra `JSON.stringify` de arrays: serialize à mão.

## Privacidade: a extensão não coleta nada

Hoje ela **não faz requisições de rede, não lê usuário nem senha e só pede a permissão `storage`**. Antes de qualquer mudança que leia dados novos da página, acesse outro site, faça `fetch` ou peça outra permissão: **avise a pessoa**, explique o impacto e, se ela quiser seguir, atualize junto o [PRIVACY.md](PRIVACY.md), as justificativas em [loja/descricao.md](loja/descricao.md) e a seção "Permissões" do README.

Nunca commite capturas de telas logadas, nomes, matrículas, `jsessionid` nem credenciais. `.playwright-mcp/` já é ignorada. Capturas da loja só de telas públicas, em janela de 1280×800, versão web.

## Como testar

- **Sem login:** a tela pública <https://sigaa.ufcg.edu.br/sigaa/verTelaLogin.do> mostra o tema, o escuro (mude o tema do sistema ou use o popup) e o popup.
- **Telas logadas:** você **não tem** o login da pessoa. Não peça nem digite senha. Peça que ela abra a tela e descreva o resultado (ou mande captura **sem dados pessoais**). Navegação logada é só leitura: não envie formulários, matrículas, solicitações nem altere dados.
- **Iterar rápido:** `scripts/preview.js` (feito para o Playwright MCP) injeta os CSS na aba atual. Ajuste `dir` e `out` no topo do arquivo para a pasta da pessoa.
- **Antes de uma versão:** `node scripts/verificar-release.js vX.Y.Z` confere se todo arquivo do manifest existe e se a tag bate com a versão.

## Versão e publicação

Para uma versão nova: aumente `version` no `manifest.json`, faça o commit e crie a tag `vX.Y.Z` com o mesmo número. O workflow `.github/workflows/release.yml` gera o `.zip` e a Release (detalhes no README, "Publicar uma versão"). O mesmo `.zip` vai para a Chrome Web Store, cujos textos estão em `loja/descricao.md`.

**Chrome Web Store:** a extensão está publicada, como **não listada**, em <https://chromewebstore.google.com/detail/sigaa-moderno-ufcg/gmpbhgljjdbimppdologlnfkchldbhkh> (ID `gmpbhgljjdbimppdologlnfkchldbhkh`). O link já está no README. Uma versão nova segue o caminho acima e depois é enviada à loja em **Package → Upload new package**, com o passo a passo em `loja/descricao.md`.

## Estilo

- Código e comentários em **português do Brasil**; comentário curto que explica o **porquê**, não o quê.
- CSS aninhado, indentação de 2 espaços. JS com aspas simples, ponto e vírgula e funções pequenas.
- Mantenha o projeto **sem build e sem dependências**: nada de npm, bundler ou framework.
- Mensagens de commit em português, no imperativo, sem linha de coautoria.

## Decisões do dono do projeto (não reverta sem pedido)

- **Não esconder a barra de menus do portal nem trocar o menu por cartões.** Foi proposto e rejeitado. Se pedirem algo parecido, pergunte antes se querem um menu suspenso maior ou um painel sempre visível.
- O **layout de celular existe só na Turma Virtual** (até 900px). Portal e listagens continuam só para desktop.
- A identidade azul (`#404e82`) e laranja (`#d99c44`) do SIGAA se mantém por padrão; troca de cores é escolha de quem personaliza, não do padrão do projeto.
