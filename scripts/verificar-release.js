// Confere se o manifest está pronto para uma release:
//  - todo arquivo que ele referencia (CSS, JS, popup, ícones) existe;
//  - se um nome de tag for passado, a versão do manifest bate com ele.
//
//   node scripts/verificar-release.js          só confere os arquivos
//   node scripts/verificar-release.js v0.1.0   confere também a versão
//
// Roda na raiz do projeto, no workflow .github/workflows/release.yml.
const fs = require('node:fs');

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const tag = process.argv[2];
const erros = [];

// Qualquer texto do manifest com cara de arquivo da extensão ("src/x.css", "icons/a.png").
const arquivos = new Set();
const percorrer = (valor) => {
  if (typeof valor === 'string') {
    if (/\.(css|js|html|png|svg|json)$/.test(valor)) arquivos.add(valor);
  } else if (valor && typeof valor === 'object') {
    Object.values(valor).forEach(percorrer);
  }
};
percorrer(manifest);

for (const arquivo of arquivos) {
  if (!fs.existsSync(arquivo)) erros.push(`arquivo do manifest não existe: ${arquivo}`);
}

if (tag && tag.replace(/^v/, '') !== manifest.version) {
  erros.push(`a tag ${tag} não bate com a versão do manifest (${manifest.version})`);
}

if (erros.length) {
  erros.forEach((erro) => console.error(`erro: ${erro}`));
  process.exit(1);
}
console.log(`ok: versão ${manifest.version}, ${arquivos.size} arquivos conferidos`);
