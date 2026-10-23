# Política de privacidade — SIGAA Moderno

Última atualização: 23 de outubro de 2026.

O **SIGAA Moderno** é uma extensão de navegador que muda a aparência do SIGAA da UFCG (tema claro e escuro, busca no menu). É um projeto independente, sem vínculo oficial com a UFCG ou a UFRN.

## Resumo

**A extensão não coleta, não envia e não compartilha nenhum dado.** Ela não tem servidor, conta, análise de uso, anúncios nem rastreamento, e não faz nenhuma requisição de rede por conta própria. Tudo acontece no seu navegador.

## O que a extensão guarda, e só no seu navegador

| Dado | Onde fica | Para quê |
| --- | --- | --- |
| Duas preferências: tema ligado ou desligado (`enabled`) e tema claro, escuro ou automático (`theme`) | `chrome.storage.sync` (o navegador pode sincronizar com a sua conta Google/Edge, como faz com qualquer extensão) e um espelho no `localStorage` do site do SIGAA (chave `sg-prefs`) | Aplicar o tema antes da primeira pintura da página, sem "piscar" |
| Cópia do menu do Portal do Discente: só os rótulos dos itens e as ações do menu, sem nenhum dado pessoal | `chrome.storage.local` | A busca Ctrl+K funcionar nas telas que não têm o menu |
| Um pedido temporário de abertura de item do menu | `sessionStorage` da aba (chave `sg-menu-pending`), válido por 30 segundos e apagado na carga seguinte da página | Abrir o item escolhido na busca depois de passar pelo Portal do Discente |

## O que a extensão lê da página, sem guardar nem enviar

- Os rótulos e ações do menu do SIGAA, para montar a busca.
- Na Turma Virtual, o código, o nome e os detalhes da turma e o nome exibido do usuário, só para montar a faixa da turma e as iniciais do avatar na tela. Esses textos não são gravados em lugar nenhum.

A extensão **não lê nem guarda usuário, senha, notas, matrícula, mensagens ou qualquer outro conteúdo** das suas telas, e não altera dados do sistema: a busca no menu apenas aciona os mesmos itens do menu do SIGAA, como se você clicasse neles.

## Permissões

- **`storage`**: guardar as preferências e a cópia do menu descritas acima.
- **Acesso a `https://sigaa.ufcg.edu.br/*` e `https://sigrh.ufcg.edu.br/cxpostal/*`** (Caixa Postal): aplicar o visual e os scripts de interface somente nessas páginas. A extensão não atua em nenhum outro site e não pede permissão de abas, histórico, cookies nem downloads.

A extensão não carrega nem executa código remoto: todo o código está no próprio pacote.

## Compartilhamento

Nenhum dado é vendido, transferido ou compartilhado com terceiros. O uso de qualquer informação segue a política de dados do usuário da Chrome Web Store, incluindo os requisitos de Uso Limitado.

## Como apagar os dados

- Desinstalar a extensão remove o que ela guardou em `chrome.storage`.
- A chave `sg-prefs` (`localStorage`) e a `sg-menu-pending` (`sessionStorage`) ficam no navegador, no site do SIGAA. Para apagá-las, limpe os dados do site `sigaa.ufcg.edu.br` nas configurações do navegador.

## Contato e mudanças

Dúvidas ou problemas: abra uma *issue* em <https://github.com/RonildoLima/extensao-sigaa/issues>. Se esta política mudar, a data no topo é atualizada e a alteração fica no histórico do repositório.
