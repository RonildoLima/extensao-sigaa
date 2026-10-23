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

**Uso de dados** ("Quais dados você pretende coletar dos usuários agora ou no futuro?"): marque **só "Conteúdo do site"** e deixe os outros oito desmarcados.

Por quê: a FAQ da loja diz que "tratar" dados inclui coletar, transmitir, usar ou compartilhar, e que isso deve ser declarado "mesmo quando os dados são processados ou guardados localmente". A extensão lê texto da página (os rótulos do menu, que ficam em cache no navegador, e os dados da turma e o nome exibido, usados só para montar a faixa da turma e as iniciais do avatar). Nada disso sai do navegador, e o `PRIVACY.md` já descreve exatamente isso.

Os outros tipos não se aplicam: a extensão não lê usuário nem senha (autenticação), mensagens (comunicações pessoais), localização, histórico de navegação, nem cliques ou teclas (atividade do usuário). O nome só aparece na tela para formar as iniciais e não é guardado; se preferir a máxima cautela, pode marcar também "Informações de identificação pessoal", sabendo que a página pública da extensão passará a exibir isso.

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

## Envio (feito em 23/10/2026)

- [x] Conta de desenvolvedor criada, com e-mail dedicado e verificação em duas etapas.
- [x] `.zip` da Release (`sigaa-moderno-v0.1.0.zip`), com o `manifest.json` na raiz.
- [x] Repositório público (a URL da política de privacidade abre sem login).
- [x] Capturas e tile enviados na ordem acima.
- [x] Textos das abas Privacy e Distribution preenchidos.
- [x] Enviada para análise.

## Quando a loja aprovar

A revisão costuma levar de alguns dias a algumas semanas e o resultado chega por e-mail, para o endereço de desenvolvedor da conta. Depois da aprovação você tem **30 dias** para publicar (a menos que tenha marcado a publicação automática).

1. No painel do desenvolvedor, abra a extensão e copie o endereço da página dela, no formato `https://chromewebstore.google.com/detail/<nome>/<id>`. Como a visibilidade é **não listada**, só quem tem esse link instala: ele é o que vai no README.
2. No `README.md`, procure `TODO(loja)` e troque a linha **Link da loja** por:

   ```md
   **Link da loja:** [SIGAA Moderno na Chrome Web Store](URL_DA_PAGINA_DA_LOJA)
   ```

   Apague os dois comentários `<!-- ... -->` logo abaixo da linha. É o único ponto do README que muda.
3. *(Opcional)* No GitHub, em **About** (engrenagem ao lado de "About" na página inicial do repositório), coloque o link da loja em **Website**.
4. Faça o commit e o push (por exemplo "Adiciona o link da Chrome Web Store ao README").

Para pedir a um agente de IA, basta dizer: `A extensão foi aprovada na Chrome Web Store: <URL>. Atualize o README e faça o commit e o push.`

**Se a loja rejeitar:** o e-mail diz qual política foi violada. Corrija, aumente `version` no `manifest.json`, crie a tag e a Release (veja "Publicar uma versão" no README) e envie o novo `.zip` em **Package → Upload new package**.

**Versões novas depois da aprovação:** o mesmo caminho do parágrafo acima. O `.zip` da Release serve direto, e a versão do `manifest.json` precisa ser maior que a publicada.
