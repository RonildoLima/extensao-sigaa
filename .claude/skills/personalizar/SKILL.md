---
name: personalizar
description: Conduz a personalização da extensão SIGAA Moderno (cores, fonte, telas, busca Ctrl+K ou recurso novo) para quem não programa. Use quando a pessoa pedir para mudar o visual ou o comportamento da extensão neste repositório.
---

A pessoa quer personalizar a extensão **SIGAA Moderno**. Pedido dela: $ARGUMENTS

Siga este roteiro, em português simples, sem jargão desnecessário:

1. **Contexto.** Leia o `AGENTS.md` (mapa "o que mudar → onde" e regras do código) e, se o pedido tocar a Turma Virtual, a busca ou o menu, as "Particularidades do SIGAA" do `README.md`.

2. **Entenda o pedido.** Se o pedido acima estiver vazio ou vago, pergunte com opções curtas, **uma pergunta por vez** (use a ferramenta de perguntas se tiver): o que mudar (cores e tema, fonte e tamanhos, uma tela específica, a busca Ctrl+K, um recurso novo) e, para uma tela, qual é. Se o pedido for claro, não pergunte nada: vá em frente.

3. **Planeje o menor caminho.** Diga em uma ou duas frases quais arquivos vai mexer. Para mudanças grandes (recurso novo, vários arquivos), confirme com a pessoa antes de editar. Mudanças de cor, fonte ou espaçamento (normalmente em `src/styles/tokens.css`) pode fazer direto.

4. **Edite respeitando as regras do `AGENTS.md`:** CSS dentro de `html[data-sg="on"]:not(.contrast)`, cores por token com `light-dark()`, sem seletor `j_id_jsp_*`, nada de rede, `eval` nem leitura de usuário e senha. Se a ideia exigir uma nova permissão, acesso a outro site ou leitura de dados novos, **pare e avise** o impacto na privacidade antes de seguir.

5. **Mostre como ver.** Diga: em `chrome://extensions`, clique em **Recarregar** na extensão "SIGAA Moderno" e dê F5 na aba do SIGAA. Se for tela logada, lembre que você não tem o login dela: peça que descreva o resultado (ou mande captura sem nome nem matrícula). Nunca peça nem digite senha.

6. **Feche o ciclo.** Resuma o que mudou em poucas linhas e ofereça: ajustar mais, desfazer (`git restore .` desfaz o que não foi commitado) ou fazer o commit (em português, sem linha de coautoria).
