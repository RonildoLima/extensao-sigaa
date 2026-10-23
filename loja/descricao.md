# Chrome Web Store — textos para colar no painel

Tudo aqui é para copiar no [painel do desenvolvedor](https://chrome.google.com/webstore/devconsole). Este arquivo e a pasta `loja/` não entram no `.zip` da extensão (o pacote leva só `manifest.json`, `src/` e `icons/`).

## Aba "Store listing"

**Nome** (vem do manifest): `SIGAA Moderno (UFCG)`
Se a loja questionar o nome por parecer vínculo oficial, tire o "(UFCG)" do `name` no manifest e mantenha "para o SIGAA da UFCG" só na descrição.

**Resumo** (vem do `description` do manifest, 119 de 132 caracteres):
`Visual moderno para o SIGAA da UFCG: tema claro e escuro, tabelas e formulários mais legíveis, sem alterar nenhum dado.`

**Idioma:** Português (Brasil)
**Categoria:** Funcionalidade e IU (escolhida no painel).

**Descrição detalhada:**

```
Visual moderno para o SIGAA da UFCG, com tema claro e escuro e busca rápida no menu.

Projeto independente: não é feito, apoiado nem mantido pela UFCG ou pela UFRN. A extensão só muda a aparência das páginas e não altera nenhum dado do sistema.

O QUE MUDA
• Largura fluida no lugar dos 984 px fixos, fonte maior e hierarquia visual clara.
• Tema claro, escuro ou automático (acompanha o seu sistema), escolhido no ícone da extensão. Desligado, o SIGAA volta ao visual original.
• Busca no menu (Ctrl+K, ⌘K no Mac): os mais de 100 itens do menu do Portal do Discente ficam pesquisáveis de qualquer tela logada, sem precisar de acento nem da ordem exata das palavras.
• Cabeçalho, painel do usuário, menus e janela de Módulos redesenhados, mantendo o azul e o laranja do SIGAA.
• Tabelas legíveis (listagens, notas e relatórios), formulários e botões com foco visível, mensagens de sucesso, aviso e erro em cartões.
• Portal do discente em cartões; Turma Virtual com barra superior em destaque, texto das aulas legível e menu lateral com seções recolhíveis.
• Tela de login em cartão e aviso de cookies que não cobre o botão Entrar.
• Caixa Postal e portal público também com o novo visual.

PRIVACIDADE
Nada é coletado nem enviado. A extensão guarda só as suas preferências de tema e uma cópia dos rótulos do menu, no seu próprio navegador. Funciona apenas em sigaa.ufcg.edu.br e na Caixa Postal (sigrh.ufcg.edu.br/cxpostal).

OBSERVAÇÕES
• Se o "Alto contraste" do próprio SIGAA estiver ligado, ele tem prioridade e o tema fica desligado.
• Para Chrome, Edge ou Brave no computador, versão 123 ou mais nova.
```

**Capturas de tela** (1280×800, versão web, em `loja/capturas/`), nesta ordem:

1. `1-antes-e-depois.png`: a mesma tela dividida ao meio, original à esquerda e com o tema à direita.
2. `2-busca-ctrl-k.png`: busca no menu, digitando "matricula" sem acento.
3. `3-login-claro.png`: tela de login, tema claro.
4. `4-login-escuro.png`: tela de login, tema escuro.
5. `5-popup-tema.png`: popup da extensão com o interruptor e a escolha de aparência.

**Tile promocional pequeno** (opcional, 440×280): `tile-pequeno-440x280.png`
**Ícone da loja** (128×128): `icons/icon128.png`

As capturas usam um perfil de navegador limpo e a tela de login pública: não há nome, matrícula nem sessão de ninguém. Na busca, os itens são rótulos reais do menu do portal, carregados no cache da extensão para a demonstração.

## Aba "Privacy"

**Propósito único:**

```
Melhorar a aparência e a navegação do SIGAA da UFCG com tema claro/escuro e busca no menu, sem alterar dados do sistema.
```

**Justificativa da permissão `storage`:**

```
Guardar as preferências do usuário (tema ligado/desligado e claro/escuro/automático) e uma cópia dos rótulos do menu do portal, para a busca funcionar fora do portal. Tudo fica no navegador.
```

**Justificativa do acesso aos sites** (`sigaa.ufcg.edu.br` e `sigrh.ufcg.edu.br/cxpostal`):

```
Aplicar CSS e scripts de interface (tema, busca no menu e ajustes de layout) somente nas páginas do SIGAA da UFCG e da Caixa Postal. A extensão não atua em nenhum outro site.
```

**Código remoto:** Não. Todo o código está no pacote; nenhuma requisição de rede é feita pela extensão.

**Uso de dados:** a extensão não envia nada para fora do navegador. Leia a definição de cada tipo na tela antes de marcar:

- Se o formulário considera "coletar" apenas o que sai do dispositivo: não marque nenhum tipo.
- Se ele também conta o que é guardado localmente: marque só **Conteúdo do site** (rótulos do menu, guardados no navegador), finalidade "funcionalidade da extensão", sem compartilhamento nem venda.

**Certificações** (as três são verdadeiras para esta extensão): não vende nem transfere dados a terceiros fora dos usos aprovados; não usa dados para fins alheios ao propósito único; não usa dados para avaliar crédito ou empréstimo.

**URL da política de privacidade:** `https://github.com/RonildoLima/extensao-sigaa/blob/main/PRIVACY.md`
Só funciona se o repositório for **público** (ou hospede o `PRIVACY.md` em outro endereço público, como o GitHub Pages).

## Aba "Distribution"

- Visibilidade: **Não listada** (só quem tem o link instala). Mude para pública depois, se quiser.
- Países: Brasil, ou todos.
- Preço: gratuita.

## Campo "Test instructions"

```
A extensão só altera a aparência do SIGAA da UFCG; não envia dados nem altera informações do sistema.

Para ver o efeito sem conta: abra https://sigaa.ufcg.edu.br/sigaa/verTelaLogin.do. A tela de login aparece em cartão, com tema claro ou escuro conforme o sistema. Clique no ícone da extensão para ligar/desligar o tema e escolher Automático, Claro ou Escuro.

A busca no menu (Ctrl+K) usa o menu do Portal do Discente, que só existe depois do login. Sem login, a busca mostra um aviso pedindo para abrir o Portal do Discente uma vez para copiar os itens do menu.
```

## Antes de enviar

- [ ] Conta de desenvolvedor criada, com e-mail dedicado e verificação em duas etapas.
- [ ] `.zip` da Release (`sigaa-moderno-v0.1.0.zip`), com o `manifest.json` na raiz.
- [ ] Repositório público (ou política hospedada em outro endereço público).
- [ ] Capturas e tile enviados na ordem acima.
- [ ] Textos das abas Privacy e Distribution preenchidos.
