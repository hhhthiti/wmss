// ======================================================
// MAPA DE SEPARAÇÃO (usa o cache já carregado)
// ======================================================

let mapaItens = [];

// Esperar DOM carregar (se script estiver no final pode remover)
window.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addMapaBtn");
  const gerarBtn = document.getElementById("gerarMapaBtn");

  if (addBtn) addBtn.addEventListener("click", adicionarItemMapa);
  if (gerarBtn) gerarBtn.addEventListener("click", gerarMapaPDF);

});

function adicionarItemMapa() {

  const sku = Number(document.getElementById("mapSku").value);
  const qtd = Number(document.getElementById("mapQtd").value);

  if (!sku || !qtd) {
    alert("Informe SKU e quantidade");
    return;
  }

  mapaItens.push({ sku, qtd });

  atualizarTabelaMapa();

  document.getElementById("mapSku").value = "";
  document.getElementById("mapQtd").value = "";
}

function atualizarTabelaMapa() {

  const tbody = document.querySelector("#mapaTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  mapaItens.forEach((item, index) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.sku}</td>
      <td>${item.qtd}</td>
      <td><button onclick="removerItemMapa(${index})">Remover</button></td>
    `;

    tbody.appendChild(tr);
  });
}

function removerItemMapa(index) {
  mapaItens.splice(index, 1);
  atualizarTabelaMapa();
}

// ======================================================
// GERAR PDF DO MAPA
// ======================================================

function gerarMapaPDF() {

  if (mapaItens.length === 0) {
    alert("Nenhum item adicionado");
    return;
  }

  if (!window.jspdf) {
    alert("Biblioteca PDF não carregada");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(16);
  doc.text("MAPA DE SEPARAÇÃO", 10, y);
  y += 12;

  mapaItens.forEach(item => {

    doc.setFontSize(12);
    doc.text(`SKU: ${item.sku} — Fardos necessários: ${item.qtd}`, 10, y);
    y += 8;

    // 🔥 Usa o cache do estoque (melhor que ler tabela)
    const locais = cache.estoque
      .filter(e => e.sku === item.sku)
      .sort((a, b) => a.area.localeCompare(b.area));

    if (locais.length === 0) {
      doc.text("   NÃO ENCONTRADO NO ESTOQUE", 15, y);
      y += 6;
    } else {

      locais.forEach(loc => {
        doc.text(
          `   Área ${loc.area} → ${loc.paletes} paletes (${loc.tipo})`,
          15,
          y
        );
        y += 6;
      });

    }

    y += 6;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

  });

  const data = new Date().toLocaleString("pt-BR");
  doc.setFontSize(9);
  doc.text(`Gerado em: ${data}`, 10, 290);

  doc.save("mapa_separacao.pdf");
}
