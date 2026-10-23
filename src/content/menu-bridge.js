// Roda no mundo MAIN da página (declarado no manifest com "world": "MAIN").
//
// O menu do portal (jsCookMenu) guarda a estrutura inteira num array global
// (`menu_form_menu_discente_discente_menu`), que os content scripts normais não
// enxergam por rodarem em um mundo isolado. Este script só copia esse array
// para um <script type="application/json"> inerte; quem consome é o palette.js.
//
// Não altera o menu, não chama funções do SIGAA e não lê mais nada da página.
(() => {
  const DATA_ID = 'sg-menu-data';
  if (document.getElementById(DATA_ID)) return;

  // O <div> do menu já existe no HTML antes de o cmDraw preenchê-lo; o array
  // com o mesmo id é definido por um script inline logo acima dele.
  const holder = [...document.querySelectorAll('[id^="menu_form_"]')].find((el) =>
    Array.isArray(window[el.id]),
  );
  if (!holder) return;

  // O SIGAA usa um Prototype.js antigo, cujo Array.prototype.toJSON faz o
  // JSON.stringify devolver cada array já como string (JSON em dobro).
  // Serializamos à mão; o menu só tem arrays, textos, null e separadores {}.
  const serialize = (value) => {
    if (Array.isArray(value)) {
      const parts = [];
      for (let i = 0; i < value.length; i++) parts.push(serialize(value[i]));
      return '[' + parts.join(',') + ']';
    }
    if (typeof value === 'string') return JSON.stringify(value);
    return typeof value === 'object' && value !== null ? '{}' : 'null';
  };

  const node = document.createElement('script');
  node.type = 'application/json';
  node.id = DATA_ID;
  node.dataset.menuId = holder.id;
  node.textContent = serialize(window[holder.id]);
  document.body.append(node);
  document.dispatchEvent(new CustomEvent('sg:menu-ready'));
})();
