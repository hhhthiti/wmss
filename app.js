const defaultConfig = {
  url: 'https://qfjghplxbtogshfjkawx.supabase.co',
  key: 'sb_publishable_rIcKdaflOvJ0DLTJDcOrxA_bpTGG2hA'
};


function storageGet(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (_) {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (_) {
    return false;
  }
}

function storageGetJSON(key, fallback) {
  const raw = storageGet(key, null);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}


const el = {
  paleteIncompletoToggle: document.getElementById('paleteIncompletoToggle'),
  paleteIncompletoFields: document.getElementById('paleteIncompletoFields'),
  connectionStatus: document.getElementById('connectionStatus'),
  feedback: document.getElementById('feedback'),
  estoqueForm: document.getElementById('estoqueForm'),
  produtoForm: document.getElementById('produtoForm'),
  expedicaoForm: document.getElementById('expedicaoForm'),
  importForm: document.getElementById('importForm'),
  importFile: document.getElementById('importFile'),
  importSyncMode: document.getElementById('importSyncMode'),
  importFileName: document.getElementById('importFileName'),
  selectImportBtn: document.getElementById('selectImportBtn'),
  adminPasteForm: document.getElementById('adminPasteForm'),
  adminPasteInput: document.getElementById('adminPasteInput'),
  adminPasteSyncMode: document.getElementById('adminPasteSyncMode'),
  estoqueTableBody: document.querySelector('#estoqueTable tbody'),
  consultaAreaBody: document.querySelector('#consultaAreaTable tbody'),
  totaisSkuBody: document.querySelector('#totaisSkuTable tbody'),
  sobrasB01Body: document.querySelector('#sobrasB01Table tbody'),
  planejamentoForm: document.getElementById('planejamentoForm'),
  previsaoEntrada: document.getElementById('previsaoEntrada'),
  planejamentoFile: document.getElementById('planejamentoFile'),
  planejamentoResultado: document.getElementById('planejamentoResultado'),
  planejamentoBody: document.querySelector('#planejamentoTable tbody'),
  ocupacaoForm: document.getElementById('ocupacaoForm'),
  tissueOcupado: document.getElementById('tissueOcupado'),
  lonilOcupado: document.getElementById('lonilOcupado'),
  ocupacaoProduto: document.getElementById('ocupacaoProduto'),
  ocupacaoStatus: document.getElementById('ocupacaoStatus'),
  exportOcupacaoPdfBtn: document.getElementById('exportOcupacaoPdfBtn'),
  ocupacaoBody: document.querySelector('#ocupacaoTable tbody'),
  g1DetalheBody: document.querySelector('#g1DetalheTable tbody'),
  g1TotaisStatus: document.getElementById('g1TotaisStatus'),
  contagemForm: document.getElementById('contagemForm'),
  contagemScope: document.getElementById('contagemScope'),
  contagemSideLabel: document.getElementById('contagemSideLabel'),
  contagemSide: document.getElementById('contagemSide'),
  contagemLoadBtn: document.getElementById('contagemLoadBtn'),
  contagemEstimateBtn: document.getElementById('contagemEstimateBtn'),
  contagemExportBtn: document.getElementById('contagemExportBtn'),
  contagemStatus: document.getElementById('contagemStatus'),
  contagemBody: document.querySelector('#contagemTable tbody'),
  contagemResumoBody: document.querySelector('#contagemResumoTable tbody'),
  turnoForm: document.getElementById('turnoForm'),
  turnoFile: document.getElementById('turnoFile'),
  turnoStatus: document.getElementById('turnoStatus'),
  turnoSkuBody: document.querySelector('#turnoSkuTable tbody'),
  exportTurnoExcelBtn: document.getElementById('exportTurnoExcelBtn'),
  exportTurnoPdfBtn: document.getElementById('exportTurnoPdfBtn'),
  turnoHistoryBody: document.querySelector('#turnoHistoryTable tbody'),
  movimentacoesBody: document.querySelector('#movimentacoesTable tbody'),
  exportCadastroBtn: document.getElementById('exportCadastroBtn'),
  exportConsultaBtn: document.getElementById('exportConsultaBtn'),
  exportExpedicaoBtn: document.getElementById('exportExpedicaoBtn'),
  exportEspelhoBtn: document.getElementById('exportEspelhoBtn'),
  autoExportToggle: document.getElementById('autoExportToggle'),
  visualizarLayoutBtn: document.getElementById('visualizarLayoutBtn'),
  layoutContainer: document.getElementById('layoutContainer'),
  layoutGrid: document.getElementById('layoutGrid'),
  estruturasGrid: document.getElementById('estruturasGrid'),
  semanticLayout: document.getElementById('semanticLayout'),
  exportLayoutPdfBtn: document.getElementById('exportLayoutPdfBtn'),
  fecharLayoutBtn: document.getElementById('fecharLayoutBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn')
};

let supabaseClient;
let cache = { estoque: [], movimentacoes: [], produtos: [] };
let fracionadoMap = {};
let turnoSnapshots = storageGetJSON('wmss_turno_snapshots', []);
let lastTurnoResultado = [];
let turnoUltimaPlanilhaSku = storageGetJSON('wmss_turno_ultima_planilha_sku', {});
let contagemMap = storageGetJSON('wmss_contagem_map', {});

const manualOcupados = new Set([
  'A14', 'A15', 'A16', 'A17', 'A18', 'A19',
  'B21D', 'B20D', 'B22D', 'B20E',
  'C15', 'C14', 'C12', 'C11', 'C10', 'C09', 'C08',
  'A09', 'A08', 'A07', 'A06', 'A05', 'A04', 'A03'
]);

const capacidadeGalpoes = {
  G1: 3417,
  G2: 1728,
  G3: 1112
};

const g1Modelo = [
  { bloco: 'A', posicoes: 22, palletPosicao: 40, bloqueado: 80, terceiros: 400 },
  { bloco: 'B', posicoes: 22, palletPosicao: 40, bloqueado: 30, terceiros: 0 },
  { bloco: 'C', posicoes: 22, palletPosicao: 32, bloqueado: 16, terceiros: 0 },
  { bloco: 'D', posicoes: 22, palletPosicao: 48, bloqueado: 20, terceiros: 412 },
  { bloco: 'H1', posicoes: 12, palletPosicao: 40, bloqueado: 40, terceiros: 120 },
  { bloco: 'H2', posicoes: 2, palletPosicao: 32, bloqueado: 16, terceiros: 0 },
  { bloco: 'H3', posicoes: 4, palletPosicao: 48, bloqueado: 16, terceiros: 0 },
  { bloco: 'PP', posicoes: 1, palletPosicao: 364, bloqueado: 0, terceiros: 53 }
];

const capacidadePlanejamento = {
  A: 80,
  BD: 40,
  BE: 32,
  C: 48
};

const autoExportEnabled = storageGet('wmss_auto_export', '0') === '1';
if (el.autoExportToggle) el.autoExportToggle.checked = autoExportEnabled;
fracionadoMap = storageGetJSON('wmss_fracionado_map', {});

const darkModeEnabled = storageGet('wmss_theme', 'light') === 'dark';
document.body.classList.toggle('dark', darkModeEnabled);
if (el.themeToggleBtn) el.themeToggleBtn.textContent = darkModeEnabled ? '☀️ Modo claro' : '🌙 Modo escuro';

function setStatus(target, message, type = '') {
  if (!target) return;
  target.textContent = message;
  target.className = `status ${type}`.trim();
}

function showFeedback(message, type = 'success') {
  setStatus(el.feedback, message, type);
}

function normalizeText(value) {
  return String(value ?? '').trim().toUpperCase();
}

function normalizeAreaCode(value) {
  return normalizeText(value).replace(/[-_\s]/g, '');
}

function estoqueKey(area, sku, tipo) {
  return `${normalizeAreaCode(area)}|${Number(sku)}|${normalizeText(tipo)}`;
}

function getFardosPorPalete(sku) {
  const produto = cache.produtos.find((item) => Number(item.sku) === Number(sku));
  const valor = Number(produto?.fardos_por_palete);
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}

function shouldDeleteByAction(actionValue) {
  const action = normalizeText(actionValue);
  return ['APAGAR', 'EXCLUIR', 'DELETE', 'DEL', 'REMOVER', 'REMOVE'].includes(action);
}

function isRetrabalhoArea(area) {
  return normalizeAreaCode(area) === 'C01';
}

function parseIncomingForecast(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [skuRaw, paletesRaw] = line.split(',').map((part) => part?.trim());
      return { sku: Number(skuRaw), paletes: Number(paletesRaw) };
    })
    .filter((item) => Number.isFinite(item.sku) && Number.isFinite(item.paletes) && item.paletes > 0);
}

function parseIncomingForecastRows(rows) {
  return rows
    .map((row) => {
      const normalized = Object.fromEntries(
        Object.entries(row).map(([k, v]) => [String(k).trim().toLowerCase(), v])
      );
      return {
        sku: Number(normalized.sku),
        paletes: Number(normalized.paletes)
      };
    })
    .filter((item) => Number.isFinite(item.sku) && Number.isFinite(item.paletes) && item.paletes > 0);
}

function exportTurnoResultadoExcel() {
  if (!lastTurnoResultado.length) return showFeedback('Execute a conferência do turno antes de exportar.', 'error');
  exportWorkbook('resultado_turno.xlsx', [{ name: 'Saida_Turno', data: lastTurnoResultado }]);
}

function exportTurnoResultadoPDF() {
  if (!lastTurnoResultado.length) return showFeedback('Execute a conferência do turno antes de exportar.', 'error');
  if (!window.jspdf) return showFeedback('Biblioteca de PDF não carregada.', 'error');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('portrait');
  let y = 15;
  pdf.text('Resultado da Conferência de Turno', 10, y);
  y += 8;
  lastTurnoResultado.forEach((row) => {
    pdf.text(`SKU ${row.sku} | ${row.tipo} | Paletes: ${row.paletes_sairam} | Fardos: ${row.fardos_estimados}`, 10, y);
    y += 6;
    if (y > 280) {
      pdf.addPage();
      y = 15;
    }
  });
  pdf.save('resultado_turno.pdf');
}

function mapAreaToPlanejamentoBloco(area) {
  const normalized = normalizeAreaCode(area);
  if (/^A\d+$/.test(normalized)) return 'A';
  if (/^B\d+D$/.test(normalized) || /^BD\d+$/.test(normalized)) return 'BD';
  if (/^B\d+E$/.test(normalized) || /^BE\d+$/.test(normalized)) return 'BE';
  if (/^C\d+$/.test(normalized)) return 'C';
  return null;
}

function getPlanejamentoOcupacaoAtual() {
  const ocupado = { A: 0, BD: 0, BE: 0, C: 0 };
  cache.estoque.forEach((row) => {
    const bloco = mapAreaToPlanejamentoBloco(row.area);
    if (!bloco || isRetrabalhoArea(row.area)) return;
    ocupado[bloco] += Number(row.paletes || 0);
  });
  return ocupado;
}

function renderPlanejamentoTable(ocupado, previsaoPaletes = 0) {
  if (!el.planejamentoBody) return;
  el.planejamentoBody.innerHTML = '';

  const ordem = ['A', 'BD', 'BE', 'C'];
  const totalLivre = ordem.reduce((acc, bloco) => acc + Math.max(0, capacidadePlanejamento[bloco] - (ocupado[bloco] || 0)), 0);
  let restante = previsaoPaletes;

  ordem.forEach((bloco) => {
    const cap = capacidadePlanejamento[bloco];
    const ocup = ocupado[bloco] || 0;
    const livre = Math.max(0, cap - ocup);
    const alocar = Math.min(restante, livre);
    restante -= alocar;
    const apos = ocup + alocar;

    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${bloco}</td><td>${cap}</td><td>${ocup}</td><td>${livre}</td><td>${apos}</td><td>${restante >= 0 && alocar === 0 && previsaoPaletes > 0 ? 'Considerar desfazer blocado' : 'OK'}</td>`;
    el.planejamentoBody.appendChild(tr);
  });

  if (el.planejamentoResultado) {
    if (!previsaoPaletes) {
      setStatus(el.planejamentoResultado, `Capacidade livre total hoje: ${totalLivre} paletes.`, 'success');
    } else if (restante > 0) {
      setStatus(el.planejamentoResultado, `Faltam ${restante} paletes de espaço. Sugestão: desfazer blocados para abrir capacidade.`, 'error');
    } else {
      setStatus(el.planejamentoResultado, `Previsão comportada. Entrada prevista: ${previsaoPaletes} paletes.`, 'success');
    }
  }
}

function createClient() {
  try {
    if (!window.supabase?.createClient) throw new Error('Biblioteca do Supabase indisponível no momento.');
    supabaseClient = window.supabase.createClient(defaultConfig.url, defaultConfig.key);
    setStatus(el.connectionStatus, 'Conectado ao Supabase.', 'success');
    loadAll();
  } catch (error) {
    setStatus(el.connectionStatus, 'Falha de conexão com Supabase.', 'error');
    showFeedback(`Erro ao conectar no Supabase: ${error.message}`, 'error');
  }
}

async function loadEstoque() {
  const { data, error } = await supabaseClient
    .from('estoque_area')
    .select('area, sku, tipo, paletes')
    .order('area', { ascending: true })
    .order('sku', { ascending: true });

  if (error) throw error;
  cache.estoque = data ?? [];
  renderEstoque();
  renderConsulta();
}

async function loadMovimentacoes() {
  const { data, error } = await supabaseClient
    .from('movimentacoes')
    .select('id, sku, tipo, paletes, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) throw error;
  cache.movimentacoes = data ?? [];
  renderMovimentacoes();
}

async function loadProdutos() {
  const { data, error } = await supabaseClient
    .from('produtos')
    .select('sku, fardos_por_palete');

  if (error) throw error;
  cache.produtos = data ?? [];
}

async function loadAll() {
  if (!supabaseClient) return;
  try {
    await Promise.all([loadEstoque(), loadMovimentacoes(), loadProdutos()]);
    showFeedback('Dados carregados com sucesso.');
  } catch (error) {
    showFeedback(`Erro ao carregar dados: ${error.message}`, 'error');
  }
}

function renderEstoque() {
  el.estoqueTableBody.innerHTML = '';

  cache.estoque.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.area}</td>
      <td>${row.sku}</td>
      <td>${row.tipo}</td>
      <td>${row.paletes}</td>
      <td>
        <button class="edit-btn" data-action="edit">Editar</button>
        <button class="delete-btn" data-action="delete">Excluir</button>
      </td>
    `;

    tr.querySelector('[data-action="edit"]').addEventListener('click', () => {
      el.estoqueForm.area.value = row.area;
      el.estoqueForm.sku.value = row.sku;
      el.estoqueForm.tipo.value = row.tipo;
      el.estoqueForm.paletes.value = row.paletes;
      showFeedback('Registro carregado no formulário para edição.');
    });

    tr.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      if (!confirm(`Excluir ${row.sku} (${row.tipo}) da área ${row.area}?`)) return;
      try {
        const { error } = await supabaseClient
          .from('estoque_area')
          .delete()
          .match({ area: row.area, sku: row.sku, tipo: row.tipo });

        if (error) throw error;
        showFeedback('Registro excluído com sucesso.');
        await loadEstoque();
        maybeAutoExport();
      } catch (error) {
        showFeedback(`Erro ao excluir: ${error.message}`, 'error');
      }
    });

    el.estoqueTableBody.appendChild(tr);
  });
}

function groupTotalBySku(rows, options = {}) {
  const { excludeRetrabalho = false } = options;
  const filteredRows = excludeRetrabalho ? rows.filter((row) => !isRetrabalhoArea(row.area)) : rows;

  const totals = filteredRows.reduce((acc, row) => {
    acc[row.sku] = (acc[row.sku] || 0) + Number(row.paletes);
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([sku, total]) => ({ sku: Number(sku), total_paletes: total }))
    .sort((a, b) => a.sku - b.sku);
}

function renderSobrasB01() {
  if (!el.sobrasB01Body) return;
  el.sobrasB01Body.innerHTML = '';

  const sobras = cache.estoque.filter((row) => ['B01', 'B01E', 'B01D'].includes(normalizeAreaCode(row.area)));

  sobras.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.area}</td><td>${row.sku}</td><td>${row.tipo}</td><td>${row.paletes}</td>`;
    el.sobrasB01Body.appendChild(tr);
  });

  if (!sobras.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="4">Sem sobras cadastradas em B01/B01E/B01D.</td>';
    el.sobrasB01Body.appendChild(tr);
  }
}

function renderSemanticLayout() {
  if (!el.semanticLayout) return;

  el.semanticLayout.innerHTML = `
    <div class="sem-row sem-top">
      <div class="sem-tenda">TISSUE</div>
      <div class="sem-rua-top">Rua de acesso</div>
      <div class="sem-tenda">LONIL</div>
    </div>
    <div class="sem-row sem-main">
      <div class="sem-bloco">C (12 posições)</div>
      <div class="sem-bloco">BE / BD (12 posições)</div>
      <div class="sem-bloco">A (12 posições)</div>
      <div class="sem-servicos">
        <span>Extintores</span>
        <span>Escritório</span>
        <span>Banheiro</span>
      </div>
    </div>
    <div class="sem-row sem-foot">
      <small>Obs.: B01 (E/D) = área de sobras | C01 = retrabalho (fora do total).</small>
    </div>
  `;
}

function renderConsulta() {
  el.consultaAreaBody.innerHTML = '';
  cache.estoque.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.area}</td><td>${row.sku}</td><td>${row.tipo}</td><td>${row.paletes}</td>`;
    el.consultaAreaBody.appendChild(tr);
  });

  const totais = groupTotalBySku(cache.estoque, { excludeRetrabalho: true });
  el.totaisSkuBody.innerHTML = '';
  totais.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.sku}</td><td>${item.total_paletes}</td>`;
    el.totaisSkuBody.appendChild(tr);
  });

  renderSobrasB01();
  renderPlanejamentoTable(getPlanejamentoOcupacaoAtual(), 0);
  renderOcupacao();
}

function getOccupiedByWarehouse() {
  let g1 = 0;
  let g2 = 0;
  let g3 = 0;

  cache.estoque.forEach((row) => {
    const area = normalizeAreaCode(row.area);
    const pal = Number(row.paletes || 0);
    if (/^TISSUE\d+[ED]?$/.test(area)) {
      g2 += pal;
    } else if (/^LONIL\d+[ED]?$/.test(area)) {
      g3 += pal;
    } else if (/^(A|B|C|D|BE|BD)\d+[ED]?$/.test(area)) {
      g1 += pal;
    }
  });

  return { g1, g2, g3 };
}

function getPaletesResumoPorSetor() {
  const resumo = { principal: 0, tissue: 0, lonil: 0, ttd: 0 };
  cache.estoque.forEach((row) => {
    const area = normalizeAreaCode(row.area);
    const pal = Number(row.paletes || 0);
    if (/^A\d+$/.test(area) || /^B\d+[ED]?$/.test(area) || /^C\d+$/.test(area)) {
      resumo.principal += pal;
    } else if (/^TISSUE\d+[ED]?$/.test(area)) {
      resumo.tissue += pal;
    } else if (/^LONIL\d+[ED]?$/.test(area)) {
      resumo.lonil += pal;
    } else if (/^TTD\d+[ED]?$/.test(area)) {
      resumo.ttd += pal;
    }
  });
  return resumo;
}

function exportOcupacaoResumoPDF() {
  if (!window.jspdf) return showFeedback('Biblioteca de PDF não carregada.', 'error');
  const resumo = getPaletesResumoPorSetor();
  const linhas = [
    ['Principal (Ruas A/B/C)', resumo.principal],
    ['Tissue', resumo.tissue],
    ['Lonil', resumo.lonil],
    ['TTD', resumo.ttd]
  ];

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('portrait');
  let y = 15;
  pdf.setFontSize(14);
  pdf.text('Resumo de Paletes por Setor', 10, y);
  y += 8;
  pdf.setFontSize(10);
  pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 10, y);
  y += 10;

  linhas.forEach(([nome, qtd]) => {
    pdf.text(`${nome}: ${qtd} paletes`, 10, y);
    y += 7;
  });

  y += 2;
  const total = linhas.reduce((acc, item) => acc + Number(item[1] || 0), 0);
  pdf.setFontSize(11);
  pdf.text(`Total geral: ${total} paletes`, 10, y);
  pdf.save('resumo_paletes_setores.pdf');
  showFeedback('Resumo de paletes exportado em PDF com sucesso.');
}

function renderOcupacao() {
  if (!el.ocupacaoBody) return;
  el.ocupacaoBody.innerHTML = '';

  const { g1, g2, g3 } = getOccupiedByWarehouse();
  const tissueManual = Number(el.tissueOcupado?.value);
  const lonilManual = Number(el.lonilOcupado?.value);
  const produto = el.ocupacaoProduto?.value?.trim() || 'N/D';

  const g2Estimado = Number.isFinite(tissueManual) && tissueManual >= 0 ? tissueManual : g2;
  const g3Estimado = Number.isFinite(lonilManual) && lonilManual >= 0 ? lonilManual : g3;

  const rows = [
    ['G1 - Principal', capacidadeGalpoes.G1, g1],
    [`G2 - Tissue (${produto})`, capacidadeGalpoes.G2, g2Estimado],
    [`G3 - Lonil (${produto})`, capacidadeGalpoes.G3, g3Estimado]
  ];

  rows.forEach(([nome, capacidade, ocupado]) => {
    const disponivel = Math.max(0, capacidade - ocupado);
    const percentual = capacidade ? ((ocupado / capacidade) * 100).toFixed(1) : '0.0';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${nome}</td><td>${capacidade}</td><td>${ocupado}</td><td>${disponivel}</td><td>${percentual}%</td>`;
    el.ocupacaoBody.appendChild(tr);
  });

  const usandoManual = (Number.isFinite(tissueManual) && tissueManual >= 0) || (Number.isFinite(lonilManual) && lonilManual >= 0);
  setStatus(el.ocupacaoStatus, usandoManual ? 'Ocupação atualizada com contagem manual.' : 'Ocupação atualizada com dados do sistema.', 'success');
}

function calcularLinhaG1(item) {
  const total = Math.max(0, (Number(item.posicoes) * Number(item.palletPosicao)) - Number(item.bloqueado));
  const disponivel = Math.max(0, total - Number(item.terceiros));
  return { total, disponivel };
}

function renderG1Detalhe() {
  if (!el.g1DetalheBody) return;
  el.g1DetalheBody.innerHTML = '';

  let totalGeral = 0;
  let terceirosGeral = 0;
  let disponivelGeral = 0;

  g1Modelo.forEach((item) => {
    const { total, disponivel } = calcularLinhaG1(item);
    totalGeral += total;
    terceirosGeral += Number(item.terceiros);
    disponivelGeral += disponivel;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.bloco}</td>
      <td>${item.posicoes}</td>
      <td>${item.palletPosicao}</td>
      <td><input data-bloco="${item.bloco}" data-field="bloqueado" type="number" min="0" value="${item.bloqueado}" /></td>
      <td>${total}</td>
      <td><input data-bloco="${item.bloco}" data-field="terceiros" type="number" min="0" value="${item.terceiros}" /></td>
      <td>${disponivel}</td>
    `;
    el.g1DetalheBody.appendChild(tr);
  });

  setStatus(el.g1TotaisStatus, `G1 total: ${totalGeral} | terceiros: ${terceirosGeral} | disponível: ${disponivelGeral}.`, 'success');

  el.g1DetalheBody.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', (event) => {
      const bloco = event.target.dataset.bloco;
      const field = event.target.dataset.field;
      const row = g1Modelo.find((i) => i.bloco === bloco);
      if (!row) return;
      row[field] = Math.max(0, Number(event.target.value || 0));
      renderG1Detalhe();
      renderOcupacao();
    });
  });
}

function renderMovimentacoes() {
  if (!el.movimentacoesBody) return;
  el.movimentacoesBody.innerHTML = '';
  cache.movimentacoes.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(row.created_at).toLocaleString('pt-BR')}</td>
      <td>${row.sku}</td>
      <td>${row.tipo}</td>
      <td>${row.paletes}</td>
    `;
    el.movimentacoesBody.appendChild(tr);
  });
}

const estruturaLabels = [
  'R1.01-07', 'R2.01-09', 'R3.01-09', 'R3.10-16', 'R4.01-09', 'R4.10-16',
  'R5.01-09', 'R5.10-16', 'R6.01-10', 'R6.11-16', 'CHAO ESTRUTURA'
];

function expandRangeLabel(label) {
  const normalized = normalizeText(label);
  if (normalized === 'CHAO ESTRUTURA') return ['CHAO ESTRUTURA'];
  const match = normalized.match(/^(R\d+)\.(\d+)-(\d+)$/);
  if (!match) return [normalized];
  const prefix = match[1];
  const start = Number(match[2]);
  const end = Number(match[3]);
  const values = [];
  for (let i = start; i <= end; i += 1) values.push(`${prefix}.${String(i).padStart(2, '0')}`);
  return values;
}

function shouldShowContagemSide() {
  const scope = normalizeText(el.contagemScope?.value);
  return ['B', 'TISSUE', 'TTD', 'LONIL'].includes(scope);
}

function updateContagemSideVisibility() {
  if (!el.contagemSide) return;
  const visible = shouldShowContagemSide();
  const sideLabel = document.getElementById('contagemSideLabel');
  sideLabel?.classList.toggle('hidden', !visible);
  if (!visible) el.contagemSide.value = 'ALL';
}

function getContagemPositions(scope, side = 'ALL') {
  const s = normalizeText(scope);
  if (s === 'A') return Array.from({ length: 26 }, (_, i) => `A${String(i + 1).padStart(2, '0')}`);
  if (s === 'C') return Array.from({ length: 26 }, (_, i) => `C${String(i + 1).padStart(2, '0')}`);
  if (s === 'B') {
    const b = [];
    for (let i = 1; i <= 22; i += 1) {
      const base = `B${String(i).padStart(2, '0')}`;
      if (side === 'D') b.push(`${base}D`);
      else if (side === 'E') b.push(`${base}E`);
      else {
        b.push(`${base}D`);
        b.push(`${base}E`);
      }
    }
    return b;
  }
  if (s === 'ESTRUTURA') return [...new Set(estruturaLabels.flatMap(expandRangeLabel))];
  if (['TISSUE', 'TTD', 'LONIL'].includes(s)) {
    const fromDb = cache.estoque
      .map((row) => normalizeAreaCode(row.area))
      .filter((area) => area.startsWith(s));
    const maxPos = fromDb.reduce((max, area) => {
      const m = area.match(/^(?:TISSUE|TTD|LONIL)(\d+)/);
      return m ? Math.max(max, Number(m[1])) : max;
    }, 0);
    const qty = maxPos || 20;
    const out = [];
    for (let i = 1; i <= qty; i += 1) {
      const base = `${s}${String(i).padStart(2, '0')}`;
      if (side === 'D') out.push(`${base}D`);
      else if (side === 'E') out.push(`${base}E`);
      else {
        out.push(`${base}D`);
        out.push(`${base}E`);
      }
    }
    return out;
  }
  return [];
}

function getContagemEntries(posicao) {
  const raw = contagemMap[posicao];
  const asArray = Array.isArray(raw) ? raw : (raw ? [raw] : []);
  if (!asArray.length) return [createEmptyContagemEntry()];
  return asArray.map((item) => ({
    sku: item.sku || '',
    profundidade1: Number(item.profundidade1 || 0),
    largura1: Number(item.largura1 || 0),
    segundaCamada: typeof item.segundaCamada === 'boolean' ? item.segundaCamada : (Number(item.profundidade2 || 0) > 0 || Number(item.largura2 || 0) > 0),
    profundidade2: Number(item.profundidade2 || 0),
    largura2: Number(item.largura2 || 0),
    terceiraCamada: Boolean(item.terceiraCamada),
    paletesTerceira: Number(item.paletesTerceira || 0),
    fileiraIncompleta: Boolean(item.fileiraIncompleta),
    paletesAjuste: Number(item.paletesAjuste || 0),
    fardosFaltando: Number(item.fardosFaltando || 0),
    totalManual: Number(item.totalManual || 0)
  }));
}

function createEmptyContagemEntry() {
  return {
    sku: '',
    profundidade1: 0,
    largura1: 0,
    segundaCamada: false,
    profundidade2: 0,
    largura2: 0,
    terceiraCamada: false,
    paletesTerceira: 0,
    fileiraIncompleta: false,
    paletesAjuste: 0,
    fardosFaltando: 0,
    totalManual: 0
  };
}

function saveContagemEntries(posicao, entries) {
  const normalized = entries.map((entry) => ({
    ...createEmptyContagemEntry(),
    ...entry
  }));
  contagemMap[posicao] = normalized;
  storageSet('wmss_contagem_map', JSON.stringify(contagemMap));
}

function addContagemEntry(posicao) {
  const entries = getContagemEntries(posicao);
  entries.push(createEmptyContagemEntry());
  saveContagemEntries(posicao, entries);
}

function removeContagemEntry(posicao, idx) {
  const entries = getContagemEntries(posicao);
  if (entries.length <= 1) return;
  entries.splice(idx, 1);
  saveContagemEntries(posicao, entries);
}

function computeContagem(posicao, entry, scope = el.contagemScope?.value) {
  const st = { ...createEmptyContagemEntry(), ...(entry || {}) };
  const isEstrutura = normalizeText(scope) === 'ESTRUTURA';
  const basePrimeira = Math.max(0, st.profundidade1 * st.largura1);
  const baseSegunda = st.segundaCamada ? Math.max(0, st.profundidade2 * st.largura2) : 0;
  const base = isEstrutura ? (normalizeText(st.sku) ? 1 : 0) : basePrimeira + baseSegunda;
  const terceira = st.terceiraCamada ? Math.max(0, st.paletesTerceira) : 0;
  const ajuste = st.fileiraIncompleta ? Math.max(0, st.paletesAjuste) : 0;
  const paletesCalculados = base + terceira + ajuste;
  const paletes = Number(st.totalManual) > 0 ? Number(st.totalManual) : paletesCalculados;
  const fpp = getFardosPorPalete(st.sku);
  const faltando = Math.max(0, st.fardosFaltando || 0);
  const fardosBrutos = fpp ? paletes * fpp : null;
  const fardos = Number.isFinite(fardosBrutos) ? Math.max(0, fardosBrutos - faltando) : null;
  return { ...st, posicao, paletes, paletesCalculados, fardos };
}

function dividirQuantidade(total, slots) {
  const qtd = Math.max(0, Number(total) || 0);
  if (!slots) return [];
  const base = Math.floor(qtd / slots);
  const resto = qtd % slots;
  return Array.from({ length: slots }, (_, idx) => base + (idx < resto ? 1 : 0));
}

function estimateLayersFromTotal(totalPaletes) {
  const total = Math.max(0, Number(totalPaletes) || 0);
  const capacidadeCamada = 15;
  const primeira = Math.min(total, capacidadeCamada);
  const segunda = Math.min(Math.max(0, total - capacidadeCamada), capacidadeCamada);
  const terceira = Math.max(0, total - (capacidadeCamada * 2));

  const toDepthWidth = (qty) => {
    if (qty <= 0) return { profundidade: 0, largura: 0 };
    const profundidade = Math.min(5, qty);
    const largura = Math.min(3, Math.ceil(qty / profundidade));
    return { profundidade, largura };
  };

  const c1 = toDepthWidth(primeira);
  const c2 = toDepthWidth(segunda);
  return {
    profundidade1: c1.profundidade,
    largura1: c1.largura,
    segundaCamada: segunda > 0,
    profundidade2: c2.profundidade,
    largura2: c2.largura,
    terceiraCamada: terceira > 0,
    paletesTerceira: terceira
  };
}

function estimateContagemFromTurno(scope, side = 'ALL') {
  const skuTotals = turnoUltimaPlanilhaSku || {};
  const skusDisponiveis = Object.keys(skuTotals).filter((sku) => Number(skuTotals[sku]) > 0);
  if (!skusDisponiveis.length) return 0;

  const positions = getContagemPositions(scope, side);
  const targetsBySku = {};
  positions.forEach((posicao) => {
    const entries = getContagemEntries(posicao);
    entries.forEach((entry, idx) => {
      const sku = normalizeText(entry.sku);
      if (!sku || !Number(skuTotals[sku])) return;
      if (!targetsBySku[sku]) targetsBySku[sku] = [];
      targetsBySku[sku].push({ posicao, idx });
    });
  });

  let estimadas = 0;
  Object.entries(targetsBySku).forEach(([sku, targets]) => {
    const distribuicao = dividirQuantidade(Number(skuTotals[sku] || 0), targets.length);
    targets.forEach((target, i) => {
      const entries = getContagemEntries(target.posicao);
      const current = { ...entries[target.idx] };
      const total = distribuicao[i] || 0;
      current.totalManual = total;
      if (normalizeText(scope) !== 'ESTRUTURA') Object.assign(current, estimateLayersFromTotal(total));
      entries[target.idx] = current;
      saveContagemEntries(target.posicao, entries);
      estimadas += 1;
    });
  });

  return estimadas;
}


function renderContagemResumo(rows) {
  if (!el.contagemResumoBody) return;
  el.contagemResumoBody.innerHTML = '';
  const grouped = rows.reduce((acc, row) => {
    const sku = normalizeText(row.sku);
    if (!sku || row.paletes <= 0) return acc;
    if (!acc[sku]) acc[sku] = { sku, paletes: 0, fardos: 0, missing: false };
    acc[sku].paletes += row.paletes;
    if (Number.isFinite(row.fardos)) acc[sku].fardos += row.fardos;
    else acc[sku].missing = true;
    return acc;
  }, {});
  const rowsResumo = Object.values(grouped).sort((a, b) => Number(a.sku) - Number(b.sku));
  rowsResumo.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.sku}</td><td>${row.paletes}</td><td>${row.missing ? 'SKU sem fardos/palete' : row.fardos}</td>`;
    el.contagemResumoBody.appendChild(tr);
  });
  if (!rowsResumo.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="3">Sem posições preenchidas.</td>';
    el.contagemResumoBody.appendChild(tr);
  }
}

function preloadContagemFromEstoque(scope, side = 'ALL') {
  const positions = new Set(getContagemPositions(scope, side));
  let preenchidas = 0;

  positions.forEach((posicao) => {
    const existentes = getContagemEntries(posicao);
    const temDadosDigitados = existentes.some((entry) => normalizeText(entry.sku) || Number(entry.profundidade1) > 0 || Number(entry.largura1) > 0 || Number(entry.profundidade2) > 0 || Number(entry.largura2) > 0 || Number(entry.paletesTerceira) > 0 || Number(entry.paletesAjuste) > 0 || Number(entry.fardosFaltando) > 0 || Number(entry.totalManual) > 0);
    if (temDadosDigitados) return;

    const rows = cache.estoque
      .filter((row) => normalizeAreaCode(row.area) === posicao)
      .sort((a, b) => Number(a.sku) - Number(b.sku));

    if (!rows.length) return;

    const entries = rows.map((row) => ({
      ...createEmptyContagemEntry(),
      sku: String(row.sku || '')
    }));

    saveContagemEntries(posicao, entries);
    preenchidas += 1;
  });

  return preenchidas;
}

function renderContagemTable() {
  if (!el.contagemBody) return;
  updateContagemSideVisibility();
  const scope = el.contagemScope?.value;
  const isEstrutura = normalizeText(scope) === 'ESTRUTURA';
  const positions = getContagemPositions(scope, el.contagemSide?.value || 'ALL');
  el.contagemBody.innerHTML = '';
  const computedRows = [];

  positions.forEach((posicao) => {
    const entries = getContagemEntries(posicao);

    entries.forEach((entry, idx) => {
      const result = computeContagem(posicao, entry, scope);
      computedRows.push(result);
      const tr = document.createElement('tr');
      const posLabel = idx === 0 ? posicao : `<span class="contagem-posicao-sub">↳ ${posicao}</span>`;
      const plusOrRemove = idx === 0
        ? `<button type="button" class="secondary contagem-plus-btn" data-action="add-entry" data-posicao="${posicao}">+</button>`
        : `<button type="button" class="contagem-remove-btn" data-action="remove-entry" data-posicao="${posicao}" data-entry-idx="${idx}">−</button>`;

      tr.innerHTML = `
        <td>${plusOrRemove}</td>
        <td>${posLabel}</td>
        <td><input class="contagem-sku-input" data-posicao="${posicao}" data-entry-idx="${idx}" data-field="sku" value="${entry.sku || ''}" /></td>
        <td>${isEstrutura ? '<span>-</span>' : `<input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="profundidade1" type="number" min="0" value="${entry.profundidade1 || ''}" />`}</td>
        <td>${isEstrutura ? '<span>-</span>' : `<input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="largura1" type="number" min="0" value="${entry.largura1 || ''}" />`}</td>
        <td>${isEstrutura ? '<span>-</span>' : `<input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="segundaCamada" type="checkbox" ${entry.segundaCamada ? 'checked' : ''} />`}</td>
        <td>${isEstrutura ? '<span>-</span>' : (entry.segundaCamada ? `<input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="profundidade2" type="number" min="0" value="${entry.profundidade2 || ''}" />` : '<span class="contagem-collapsed">marque 2ª camada</span>')}</td>
        <td>${isEstrutura ? '<span>-</span>' : (entry.segundaCamada ? `<input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="largura2" type="number" min="0" value="${entry.largura2 || ''}" />` : '<span class="contagem-collapsed">marque 2ª camada</span>')}</td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="terceiraCamada" type="checkbox" ${entry.terceiraCamada ? 'checked' : ''} /></td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="paletesTerceira" type="number" min="0" value="${entry.paletesTerceira || ''}" ${entry.terceiraCamada ? '' : 'disabled'} /></td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="fileiraIncompleta" type="checkbox" ${entry.fileiraIncompleta ? 'checked' : ''} /></td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="paletesAjuste" type="number" min="0" value="${entry.paletesAjuste || ''}" ${entry.fileiraIncompleta ? '' : 'disabled'} /></td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="fardosFaltando" type="number" min="0" value="${entry.fardosFaltando || ''}" /></td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="totalManual" type="number" min="0" value="${entry.totalManual || ''}" /></td>
        <td>${result.paletes}</td>
        <td>${Number.isFinite(result.fardos) ? result.fardos : '-'}</td>
      `;
      el.contagemBody.appendChild(tr);
    });
  });

  el.contagemBody.querySelectorAll('button[data-action="add-entry"]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      addContagemEntry(event.currentTarget.dataset.posicao);
      renderContagemTable();
    });
  });

  el.contagemBody.querySelectorAll('button[data-action="remove-entry"]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const { posicao, entryIdx } = event.currentTarget.dataset;
      removeContagemEntry(posicao, Number(entryIdx));
      renderContagemTable();
    });
  });

  el.contagemBody.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', (event) => {
      const { posicao, entryIdx, field } = event.target.dataset;
      const entries = getContagemEntries(posicao);
      const idx = Number(entryIdx || 0);
      const current = { ...entries[idx] };
      current[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      if (field === 'segundaCamada' && !event.target.checked) {
        current.profundidade2 = 0;
        current.largura2 = 0;
      }
      if (field === 'terceiraCamada' && !event.target.checked) current.paletesTerceira = 0;
      if (field === 'fileiraIncompleta' && !event.target.checked) current.paletesAjuste = 0;
      entries[idx] = current;
      saveContagemEntries(posicao, entries);
      renderContagemTable();
    });
  });

  renderContagemResumo(computedRows);
}

function exportContagemExcel() {
  const scope = el.contagemScope?.value;
  const rows = getContagemPositions(scope, el.contagemSide?.value || 'ALL')
    .flatMap((p) => getContagemEntries(p).map((entry, idx) => ({ ...computeContagem(p, entry, scope), entry_idx: idx + 1 })))
    .filter((row) => normalizeText(row.sku) && row.paletes > 0)
    .map((row) => ({
      posicao: row.posicao,
      sku: row.sku,
      item_posicao: row.entry_idx,
      profundidade_1: row.profundidade1,
      largura_1: row.largura1,
      segunda_camada: row.segundaCamada ? 'SIM' : 'NAO',
      profundidade_2: row.profundidade2,
      largura_2: row.largura2,
      terceira_camada: row.terceiraCamada ? 'SIM' : 'NAO',
      paletes_terceira: row.terceiraCamada ? row.paletesTerceira : 0,
      fileira_incompleta: row.fileiraIncompleta ? 'SIM' : 'NAO',
      paletes_ajuste: row.fileiraIncompleta ? row.paletesAjuste : 0,
      fardos_faltando: row.fardosFaltando || 0,
      total_editavel: row.totalManual || 0,
      paletes_totais: row.paletes,
      fardos_totais: Number.isFinite(row.fardos) ? row.fardos : ''
    }));
  if (!rows.length) return showFeedback('Nenhuma posição preenchida para exportar.', 'error');
  const resumo = Object.values(rows.reduce((acc, row) => {
    const sku = String(row.sku);
    if (!acc[sku]) acc[sku] = { sku, paletes: 0, fardos: 0 };
    acc[sku].paletes += Number(row.paletes_totais || 0);
    acc[sku].fardos += Number(row.fardos_totais || 0);
    return acc;
  }, {}));
  exportWorkbook('contagem.xlsx', [
    { name: 'Contagem', data: rows },
    { name: 'Resumo_SKU', data: resumo }
  ]);
  showFeedback('Contagem exportada com sucesso.');
}

function setupContagem() {
  updateContagemSideVisibility();
  el.contagemScope?.addEventListener('change', () => {
    updateContagemSideVisibility();
    renderContagemTable();
  });
  el.contagemSide?.addEventListener('change', renderContagemTable);
  el.contagemLoadBtn?.addEventListener('click', () => {
    const scope = el.contagemScope?.value;
    const side = el.contagemSide?.value || 'ALL';
    const preenchidas = preloadContagemFromEstoque(scope, side) || 0;
    const estimadas = estimateContagemFromTurno(scope, side);
    renderContagemTable();
    setStatus(el.contagemStatus, `Posições carregadas para preenchimento. SKU(s) sugeridos em ${preenchidas} posição(ões). Estimativa da conferência aplicada em ${estimadas} linha(s).`, 'success');
  });
  el.contagemEstimateBtn?.addEventListener('click', () => {
    const scope = el.contagemScope?.value;
    const side = el.contagemSide?.value || 'ALL';
    const estimadas = estimateContagemFromTurno(scope, side);
    renderContagemTable();
    setStatus(el.contagemStatus, estimadas
      ? `Estimativa da última conferência aplicada em ${estimadas} linha(s). Campos continuam editáveis, inclusive o total.`
      : 'Não há dados da última conferência para estimar (suba a planilha na aba Conferência de turno).', estimadas ? 'success' : 'error');
  });
  el.contagemForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    renderContagemTable();
    setStatus(el.contagemStatus, 'Cálculo atualizado.', 'success');
  });
  el.contagemExportBtn?.addEventListener('click', exportContagemExcel);
}

async function handleEstoqueSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) return showFeedback('Conecte ao Supabase primeiro.', 'error');

  const formData = new FormData(event.target);
  const payload = {
    area: normalizeAreaCode(formData.get('area')),
    sku: Number(formData.get('sku')),
    tipo: normalizeText(formData.get('tipo')),
    paletes: Number(formData.get('paletes'))
  };

  const fardosInput = Number(formData.get('fardos_por_palete'));
  const fardosExistente = getFardosPorPalete(payload.sku);
  if (!fardosExistente && (!Number.isFinite(fardosInput) || fardosInput <= 0)) {
    return showFeedback('SKU sem fardos por palete cadastrado. Informe no campo "Fardos por palete (SKU novo)".', 'error');
  }

  const paletesIncompletos = Number(formData.get('paletes_incompletos'));
  const fardosIncompletos = Number(formData.get('fardos_incompletos'));
  const incompletoAtivo = el.paleteIncompletoToggle?.checked;

  try {
    if (!fardosExistente && Number.isFinite(fardosInput) && fardosInput > 0) {
      const { error: produtoError } = await supabaseClient
        .from('produtos')
        .upsert({ sku: payload.sku, fardos_por_palete: fardosInput });
      if (produtoError) throw produtoError;
    }

    const { error } = await supabaseClient.from('estoque_area').upsert(payload);
    if (error) throw error;

    const chave = estoqueKey(payload.area, payload.sku, payload.tipo);
    if (incompletoAtivo) {
      if (!Number.isFinite(paletesIncompletos) || paletesIncompletos <= 0 || !Number.isFinite(fardosIncompletos) || fardosIncompletos <= 0) {
        return showFeedback('Informe quantidade de paletes incompletos e total de fardos.', 'error');
      }
      fracionadoMap[chave] = { paletes_incompletos: paletesIncompletos, fardos_incompletos: fardosIncompletos };
    } else {
      delete fracionadoMap[chave];
    }
    storageSet('wmss_fracionado_map', JSON.stringify(fracionadoMap));

    showFeedback('Estoque salvo com sucesso.');
    event.target.reset();
    await loadEstoque();
    maybeAutoExport();
  } catch (error) {
    showFeedback(`Erro ao salvar estoque: ${error.message}`, 'error');
  }
}

async function handleProdutoSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) return showFeedback('Conecte ao Supabase primeiro.', 'error');

  const formData = new FormData(event.target);
  const payload = {
    sku: Number(formData.get('sku')),
    fardos_por_palete: Number(formData.get('fardos_por_palete'))
  };

  try {
    const { error } = await supabaseClient.from('produtos').upsert(payload);
    if (error) throw error;
    showFeedback('Produto salvo com sucesso.');
    event.target.reset();
  } catch (error) {
    showFeedback(`Erro ao salvar produto: ${error.message}`, 'error');
  }
}

async function insertMovimentacaoExpedicao(area, sku, tipo, paletes) {
  const payloadCompleto = { operacao: 'EXPEDICAO', area, sku, tipo, paletes };
  const tentativaCompleta = await supabaseClient.from('movimentacoes').insert(payloadCompleto);

  if (!tentativaCompleta.error) return;

  const payloadBasico = { sku, tipo, paletes };
  const tentativaBasica = await supabaseClient.from('movimentacoes').insert(payloadBasico);
  if (tentativaBasica.error) throw tentativaCompleta.error;
}

async function handleExpedicaoSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) return showFeedback('Conecte ao Supabase primeiro.', 'error');

  const formData = new FormData(event.target);
  const area = normalizeAreaCode(formData.get('area'));
  const sku = Number(formData.get('sku'));
  const tipo = normalizeText(formData.get('tipo'));
  const paletes = Number(formData.get('paletes'));

  try {
    const { data: atual, error: fetchError } = await supabaseClient
      .from('estoque_area')
      .select('paletes')
      .match({ area, sku, tipo })
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!atual) throw new Error('Registro não encontrado no estoque.');
    if (atual.paletes < paletes) throw new Error('Quantidade para expedir maior que o estoque atual.');

    const novoSaldo = atual.paletes - paletes;

    if (novoSaldo === 0) {
      const { error: deleteError } = await supabaseClient
        .from('estoque_area')
        .delete()
        .match({ area, sku, tipo });
      if (deleteError) throw deleteError;
    } else {
      const { error: updateError } = await supabaseClient
        .from('estoque_area')
        .update({ paletes: novoSaldo })
        .match({ area, sku, tipo });
      if (updateError) throw updateError;
    }

    await insertMovimentacaoExpedicao(area, sku, tipo, paletes);

    showFeedback('Expedição registrada e estoque atualizado.');
    event.target.reset();
    await loadAll();
    maybeAutoExport();
  } catch (error) {
    showFeedback(`Erro na expedição: ${error.message}`, 'error');
  }
}

function consolidarPorChave(rows) {
  return rows.reduce((acc, row) => {
    const key = estoqueKey(row.area, row.sku, row.tipo);
    acc[key] = (acc[key] || 0) + Number(row.paletes || 0);
    return acc;
  }, {});
}

function saveTurnoSnapshot(snapshotRows) {
  const item = {
    created_at: new Date().toISOString(),
    rows: snapshotRows
  };

  turnoSnapshots = [item, ...turnoSnapshots].slice(0, 3);
  storageSet('wmss_turno_snapshots', JSON.stringify(turnoSnapshots));
  renderTurnoHistory();
}

function renderTurnoHistory() {
  if (!el.turnoHistoryBody) return;
  el.turnoHistoryBody.innerHTML = '';

  if (!turnoSnapshots.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="2">Sem snapshots salvos.</td>';
    el.turnoHistoryBody.appendChild(tr);
    return;
  }

  turnoSnapshots.forEach((snap) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${new Date(snap.created_at).toLocaleString('pt-BR')}</td><td>${snap.rows.length}</td>`;
    el.turnoHistoryBody.appendChild(tr);
  });
}

async function handleTurnoSubmit(event) {
  event.preventDefault();
  const file = el.turnoFile?.files?.[0];
  if (!file) return setStatus(el.turnoStatus, 'Selecione a planilha de contagem final.', 'error');

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }).map(mapImportRow);
    turnoUltimaPlanilhaSku = rows.reduce((acc, row) => {
      const sku = Number(row.sku);
      const paletes = Number(row.paletes);
      if (!Number.isFinite(sku) || !Number.isFinite(paletes) || paletes <= 0) return acc;
      const key = String(sku);
      acc[key] = (acc[key] || 0) + paletes;
      return acc;
    }, {});
    storageSet('wmss_turno_ultima_planilha_sku', JSON.stringify(turnoUltimaPlanilhaSku));

    const snapshotAnterior = turnoSnapshots[0]?.rows ?? null;
    const atual = snapshotAnterior ? consolidarPorChave(snapshotAnterior) : consolidarPorChave(cache.estoque);
    const finalTurno = consolidarPorChave(rows);
    const saidaSkuTipo = {};
    const missing = new Set();
    lastTurnoResultado = [];

    Object.keys(atual).forEach((key) => {
      const saiu = Math.max(0, Number(atual[key] || 0) - Number(finalTurno[key] || 0));
      if (!saiu) return;
      const [, sku, tipo] = key.split('|');
      const skuTipo = `${sku}|${tipo}`;
      saidaSkuTipo[skuTipo] = (saidaSkuTipo[skuTipo] || 0) + saiu;
    });

    el.turnoSkuBody.innerHTML = '';
    Object.entries(saidaSkuTipo)
      .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }))
      .forEach(([skuTipo, paletes]) => {
        const [sku, tipo] = skuTipo.split('|');
        const fpp = getFardosPorPalete(Number(sku));
        if (!fpp) missing.add(sku);
        lastTurnoResultado.push({
          sku: Number(sku),
          tipo,
          paletes_sairam: paletes,
          fardos_estimados: fpp ? paletes * fpp : 'N/D'
        });
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${sku}</td><td>${tipo}</td><td>${paletes}</td><td>${fpp ? paletes * fpp : 'N/D'}</td>`;
        el.turnoSkuBody.appendChild(tr);
      });

    if (!Object.keys(saidaSkuTipo).length) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="4">Nenhuma saída detectada na comparação.</td>';
      el.turnoSkuBody.appendChild(tr);
    }

    saveTurnoSnapshot(rows);

    if (missing.size) {
      setStatus(el.turnoStatus, `Comparação concluída (${snapshotAnterior ? 'anterior x atual' : 'estoque atual x planilha'}). SKU(s) sem fardos por palete: ${[...missing].join(', ')}.`, 'error');
    } else {
      setStatus(el.turnoStatus, `Comparação concluída com sucesso (${snapshotAnterior ? 'anterior x atual' : 'estoque atual x planilha'}).`, 'success');
    }
  } catch (error) {
    setStatus(el.turnoStatus, `Erro ao processar planilha do turno: ${error.message}`, 'error');
  }
}

function mapImportRow(rawRow) {
  const row = Object.fromEntries(
    Object.entries(rawRow).map(([k, v]) => [String(k).trim().toLowerCase(), v])
  );

  const areaRaw = row.area ?? row['área'] ?? row.endereco ?? row.endereço;
  const skuRaw = row.sku ?? row.codsku ?? row['cód_sku'];
  const tipoRaw = row.tipo ?? row.produto_tipo;
  const paletesRaw = row.paletes ?? row.pallets ?? row.quantidade;

  return {
    area: normalizeAreaCode(areaRaw),
    sku: Number(skuRaw),
    tipo: normalizeText(tipoRaw),
    paletes: Number(paletesRaw),
    acao: normalizeText(row.acao)
  };
}

function isEmptyImportItem(item) {
  return !item.area && !Number.isFinite(item.sku) && !item.tipo && !Number.isFinite(item.paletes) && !item.acao;
}

function validateImportItem(item, line) {
  if (isEmptyImportItem(item)) return 'SKIP';
  if (!item.area) return `Linha ${line}: área inválida`;
  if (!Number.isFinite(item.sku) || item.sku <= 0) return `Linha ${line}: sku inválido`;
  if (!item.tipo) return `Linha ${line}: tipo inválido`;
  const deleteRow = shouldDeleteByAction(item.acao);
  if (!deleteRow && (!Number.isFinite(item.paletes) || item.paletes < 0)) return `Linha ${line}: paletes inválido`;
  return null;
}

function parsePastedTable(text) {
  const raw = String(text || '').trim();
  if (!raw) return [];
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];

  const delim = lines[0].includes('	') ? '	' : (lines[0].includes(';') ? ';' : ',');
  const parseLine = (line) => {
    if (delim === ',') {
      const out = [];
      let cur = '';
      let quoted = false;
      for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        if (ch === '"') {
          if (quoted && line[i + 1] === '"') {
            cur += '"';
            i += 1;
          } else quoted = !quoted;
        } else if (ch === ',' && !quoted) {
          out.push(cur.trim());
          cur = '';
        } else cur += ch;
      }
      out.push(cur.trim());
      return out;
    }
    return line.split(delim).map((v) => String(v || '').trim());
  };

  const headers = parseLine(lines[0]).map((h) => normalizeText(h).toLowerCase());
  return lines.slice(1).map((line) => {
    const cols = parseLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? '';
    });
    return row;
  });
}

async function processImportRows(rows, syncMode) {
  if (!rows.length) throw new Error('Planilha vazia.');

  let insertedOrUpdated = 0;
  let deleted = 0;
  const mentionedKeys = new Set();

  for (let i = 0; i < rows.length; i += 1) {
    const item = mapImportRow(rows[i]);
    const error = validateImportItem(item, i + 2);
    if (error === 'SKIP') continue;
    if (error) throw new Error(error);

    if (shouldDeleteByAction(item.acao) || item.paletes === 0) {
      const { error: deleteError } = await supabaseClient
        .from('estoque_area')
        .delete()
        .match({ area: item.area, sku: item.sku, tipo: item.tipo });

      if (deleteError) throw new Error(`Linha ${i + 2}: ${deleteError.message}`);
      deleted += 1;
    } else {
      mentionedKeys.add(estoqueKey(item.area, item.sku, item.tipo));
      const payload = {
        area: item.area,
        sku: item.sku,
        tipo: item.tipo,
        paletes: item.paletes
      };
      const { error: upsertError } = await supabaseClient.from('estoque_area').upsert(payload);
      if (upsertError) throw new Error(`Linha ${i + 2}: ${upsertError.message}`);
      insertedOrUpdated += 1;
    }
  }

  if (syncMode) {
    const { data: atuais, error: fetchAtualError } = await supabaseClient
      .from('estoque_area')
      .select('area, sku, tipo');
    if (fetchAtualError) throw fetchAtualError;

    const paraRemover = (atuais || []).filter((row) => !mentionedKeys.has(estoqueKey(row.area, row.sku, row.tipo)));
    for (const row of paraRemover) {
      const { error: deleteSyncError } = await supabaseClient
        .from('estoque_area')
        .delete()
        .match({ area: row.area, sku: row.sku, tipo: row.tipo });
      if (deleteSyncError) throw deleteSyncError;
      deleted += 1;
    }
  }

  await loadEstoque();
  maybeAutoExport();
  return { insertedOrUpdated, deleted };
}

async function handleImportSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) return showFeedback('Conecte ao Supabase primeiro.', 'error');

  const file = el.importFile.files?.[0];
  if (!file) return showFeedback('Selecione um arquivo para importar.', 'error');

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    const { insertedOrUpdated, deleted } = await processImportRows(rows, Boolean(el.importSyncMode?.checked));
    showFeedback(`Importação concluída (${el.importSyncMode?.checked ? 'sincronização agressiva' : 'modo seguro'}). Incluídos/atualizados: ${insertedOrUpdated}. Apagados: ${deleted}.`);
    el.importForm.reset();
    if (el.importFileName) el.importFileName.textContent = 'Nenhum arquivo selecionado';
  } catch (error) {
    showFeedback(`Erro na importação: ${error.message}`, 'error');
  }
}

async function handleAdminPasteSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) return showFeedback('Conecte ao Supabase primeiro.', 'error');
  try {
    const rows = parsePastedTable(el.adminPasteInput?.value);
    const { insertedOrUpdated, deleted } = await processImportRows(rows, Boolean(el.adminPasteSyncMode?.checked));
    showFeedback(`Atualização ADM concluída (${el.adminPasteSyncMode?.checked ? 'sincronização agressiva' : 'modo seguro'}). Incluídos/atualizados: ${insertedOrUpdated}. Apagados: ${deleted}.`);
  } catch (error) {
    showFeedback(`Erro na atualização ADM: ${error.message}`, 'error');
  }
}


function parseAreaForLayout(areaRaw) {
  const area = normalizeText(areaRaw);
  const normalized = normalizeAreaCode(areaRaw);

  const bSuffixedMatch = normalized.match(/^B(\d+)([ED])$/);
  if (bSuffixedMatch) {
    const pos = Number(bSuffixedMatch[1]);
    const lado = bSuffixedMatch[2] === 'E' ? 'BE' : 'BD';
    return { bloco: lado, pos, area };
  }

  const directMatch = normalized.match(/^(TISSUE|LONIL|A|B|C|BE|BD)(\d+)$/);
  if (directMatch) {
    return { bloco: directMatch[1], pos: Number(directMatch[2]), area };
  }

  const bSplitMatch = normalized.match(/^B([ED])(\d+)$/);
  if (bSplitMatch) {
    return { bloco: `B${bSplitMatch[1]}`, pos: Number(bSplitMatch[2]), area };
  }

  const legacyBMatch = normalized.match(/^B(\d+)$/);
  if (legacyBMatch) {
    return { bloco: 'B', pos: Number(legacyBMatch[1]), area };
  }

  const tunelMatch = normalized.match(/^TUNEL(\d+)$/);
  if (tunelMatch) {
    return { bloco: 'TUNEL', pos: Number(tunelMatch[1]), area };
  }

  return null;
}

function getAreaVariants(areaCode) {
  const normalized = normalizeAreaCode(areaCode);
  const match = normalized.match(/^([A-Z]+)(\d+)([A-Z]?)$/);
  if (!match) return [normalized];
  const prefix = match[1];
  const pos = Number(match[2]);
  const suffix = match[3] || '';
  const noPad = `${prefix}${pos}${suffix}`;
  const pad2 = `${prefix}${String(pos).padStart(2, '0')}${suffix}`;
  return [...new Set([normalized, noPad, pad2])];
}

function getAreaItems(areaCode, byArea) {
  const variants = getAreaVariants(areaCode);
  const merged = [];
  variants.forEach((key) => {
    const arr = byArea.get(key);
    if (arr?.length) merged.push(...arr);
  });
  return merged;
}

function getAreaText(areaCode, byArea, fallback = 'Vazio') {
  const items = getAreaItems(areaCode, byArea);
  if (!items.length) return fallback;
  return items.map((item) => `${item.sku}`).join('; ');
}

function gerarLayoutVisual() {
  if (!el.layoutGrid || !el.layoutContainer || !el.estruturasGrid) return;

  el.layoutGrid.innerHTML = '';
  el.estruturasGrid.innerHTML = '';

  const byArea = new Map();
  cache.estoque.forEach((row) => {
    const key = normalizeAreaCode(row.area);
    if (!byArea.has(key)) byArea.set(key, []);
    byArea.get(key).push(row);
  });

  const posicoes = Array.from({ length: 26 }, (_, i) => 26 - i);
  const bPosicoes = Array.from({ length: 22 }, (_, i) => 22 - i);

  const anotacoesA = { 26: 'Bloqueado', 23: 'Bloqueado', 14: 'Recebimento', 1: 'Carregamento' };
  const anotacoesC = { 1: 'Sala ADM', 2: 'Retrabalho' };

  const criarLinha = (prefixo, anotacoes = {}) => {
    const row = document.createElement('div');
    row.className = 'bp-row';

    posicoes.forEach((pos) => {
      const area = `${prefixo}${String(pos).padStart(2, '0')}`;
      const cell = document.createElement('div');
      cell.className = 'bp-cell';
      const fallback = manualOcupados.has(area) ? 'Ocupado' : (anotacoes[pos] || 'Vazio');
      const texto = getAreaText(area, byArea, fallback);
      cell.innerHTML = `<strong>${area}</strong><div>${texto}</div>`;
      row.appendChild(cell);
    });

    return row;
  };

  const bRow = document.createElement('div');
  bRow.className = 'bp-row bp-row-b';
  Array.from({ length: 4 }).forEach(() => {
    const empty = document.createElement('div');
    empty.className = 'bp-cell bp-empty';
    bRow.appendChild(empty);
  });

  bPosicoes.forEach((pos) => {
    const areaD = `B${String(pos).padStart(2, '0')}D`;
    const areaE = `B${String(pos).padStart(2, '0')}E`;
    const textoD = getAreaText(areaD, byArea, manualOcupados.has(areaD) ? 'Ocupado' : 'Vazio');
    const textoE = getAreaText(areaE, byArea, manualOcupados.has(areaE) ? 'Ocupado' : 'Vazio');
    const cell = document.createElement('div');
    cell.className = 'bp-cell';
    const extra = pos === 1 ? '<div>Picking</div>' : '';
    cell.innerHTML = `<strong>${areaD} / ${areaE}</strong><div>D: ${textoD}</div><div>E: ${textoE}</div>${extra}`;
    bRow.appendChild(cell);
  });

  const blueprint = document.createElement('div');
  blueprint.className = 'blueprint-wrap';
  blueprint.appendChild(criarLinha('A', anotacoesA));
  blueprint.appendChild(bRow);
  blueprint.appendChild(criarLinha('C', anotacoesC));
  el.layoutGrid.appendChild(blueprint);

  const parsed = cache.estoque
    .map((item) => ({ item, meta: parseAreaForLayout(item.area) }))
    .filter((entry) => entry.meta);

  const parsedEstruturas = parsed.filter((entry) =>
    (entry.meta.bloco === 'A' && entry.meta.pos <= 5) || entry.meta.bloco === 'TUNEL'
  );

  const totaisEstruturas = parsedEstruturas.reduce((acc, entry) => {
    const chave = entry.meta.bloco === 'TUNEL' ? `TÚNEL ${entry.meta.pos}` : `A${entry.meta.pos}`;
    acc[chave] = (acc[chave] || 0) + Number(entry.item.paletes || 0);
    return acc;
  }, {});

  Object.entries(totaisEstruturas)
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .forEach(([area, caixas]) => {
      const box = document.createElement('div');
      box.className = 'estrutura-box';
      box.innerHTML = `<strong>${area}</strong><span>${caixas} caixas</span>`;
      el.estruturasGrid.appendChild(box);
    });

  if (!Object.keys(totaisEstruturas).length) {
    el.estruturasGrid.innerHTML = '<p class="helper-text">Sem caixas cadastradas em Estruturas/Túnel.</p>';
  }

  renderSemanticLayout();
  el.layoutContainer.classList.remove('hidden');
}


async function exportarLayoutPDF() {
  if (!window.html2canvas || !window.jspdf) {
    showFeedback('Bibliotecas de PDF não carregadas.', 'error');
    return;
  }

  try {
    const canvas = await window.html2canvas(el.layoutGrid, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('landscape');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const width = pageWidth - margin * 2;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', margin, margin, width, Math.min(height, pageHeight - margin * 2));
    pdf.save('Planta_Armazem.pdf');
    showFeedback('PDF do layout exportado com sucesso.');
  } catch (error) {
    showFeedback(`Erro ao exportar PDF: ${error.message}`, 'error');
  }
}


async function exportPlanilhaEspelho() {
  if (supabaseClient) {
    await loadAll();
  }

  const { rows: estoqueExportRows, missingSkus } = buildEstoqueExportRows();
  const totaisEstoque = groupTotalBySku(cache.estoque, { excludeRetrabalho: true });
  const totaisExpedido = groupTotalBySku(cache.movimentacoes);

  exportWorkbook('planilha_espelho_wmss.xlsx', [
    { name: 'Estoque', data: estoqueExportRows },
    { name: 'Totais_SKU', data: totaisEstoque },
    { name: 'Movimentacoes', data: cache.movimentacoes },
    { name: 'Totais_Expedido_SKU', data: totaisExpedido }
  ]);

  if (missingSkus.length) {
    showFeedback(`Aviso: SKU(s) sem fardos por palete cadastrado: ${missingSkus.join(', ')}.`, 'error');
  }
}

function maybeAutoExport() {
  if (!el.autoExportToggle?.checked) return;
  exportPlanilhaEspelho();
}

function buildEstoqueExportRows() {
  const missing = new Set();
  const rows = cache.estoque.map((row) => {
    const chave = estoqueKey(row.area, row.sku, row.tipo);
    const frac = fracionadoMap[chave];
    const fpp = getFardosPorPalete(row.sku);
    if (!fpp) missing.add(row.sku);
    const paletesIncompletos = Number(frac?.paletes_incompletos || 0);
    const fardosIncompletos = Number(frac?.fardos_incompletos || 0);
    const paletesContabilizados = Math.max(0, Number(row.paletes) - paletesIncompletos);
    const fardosTotaisBlocado = fpp ? (paletesContabilizados * fpp) + fardosIncompletos : null;
    return {
      ...row,
      paletes_contabilizados: paletesContabilizados,
      paletes_incompletos: paletesIncompletos,
      fardos_incompletos: fardosIncompletos,
      fardos_totais_blocado: fardosTotaisBlocado
    };
  });
  return { rows, missingSkus: [...missing] };
}

function exportWorkbook(fileName, sheets) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ name, data }) => {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, name);
  });
  XLSX.writeFile(wb, fileName);
}

function setupExports() {
  el.exportCadastroBtn.addEventListener('click', () => {
    const { rows: estoqueExportRows, missingSkus } = buildEstoqueExportRows();
    const totais = groupTotalBySku(cache.estoque, { excludeRetrabalho: true });
    exportWorkbook('cadastro_estoque.xlsx', [
      { name: 'Estoque', data: estoqueExportRows },
      { name: 'Totais_SKU', data: totais }
    ]);
    if (missingSkus.length) showFeedback(`Aviso: SKU(s) sem fardos por palete: ${missingSkus.join(', ')}.`, 'error');
  });

  el.exportConsultaBtn.addEventListener('click', () => {
    const { rows: estoqueExportRows, missingSkus } = buildEstoqueExportRows();
    const totais = groupTotalBySku(cache.estoque, { excludeRetrabalho: true });
    exportWorkbook('consulta_estoque.xlsx', [
      { name: 'Consulta_Areas', data: estoqueExportRows },
      { name: 'Totais_SKU', data: totais }
    ]);
    if (missingSkus.length) showFeedback(`Aviso: SKU(s) sem fardos por palete: ${missingSkus.join(', ')}.`, 'error');
  });

  el.exportExpedicaoBtn?.addEventListener('click', () => {
    const totaisExpedido = groupTotalBySku(cache.movimentacoes);
    exportWorkbook('expedicao.xlsx', [
      { name: 'Expedicoes', data: cache.movimentacoes },
      { name: 'Totais_Expedido_SKU', data: totaisExpedido }
    ]);
  });

  el.exportEspelhoBtn?.addEventListener('click', async () => {
    try {
      await exportPlanilhaEspelho();
      showFeedback('Planilha espelho gerada com sucesso.');
    } catch (error) {
      showFeedback(`Erro ao gerar planilha espelho: ${error.message}`, 'error');
    }
  });
}

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((section) => section.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

function setupPlanejamento() {
  el.planejamentoForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    let itens = parseIncomingForecast(el.previsaoEntrada?.value);
    const file = el.planejamentoFile?.files?.[0];
    if (file) {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      itens = parseIncomingForecastRows(rows);
    }
    const totalPrevisto = itens.reduce((acc, item) => acc + item.paletes, 0);
    renderPlanejamentoTable(getPlanejamentoOcupacaoAtual(), totalPrevisto);
  });
}

function setupOcupacao() {
  el.ocupacaoForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    renderOcupacao();
    renderG1Detalhe();
  });
}

function init() {
  setupTabs();
  setupExports();
  setupPlanejamento();
  setupOcupacao();
  setupContagem();
  renderG1Detalhe();
  renderTurnoHistory();
  el.turnoForm?.addEventListener('submit', handleTurnoSubmit);
  el.exportTurnoExcelBtn?.addEventListener('click', exportTurnoResultadoExcel);
  el.exportTurnoPdfBtn?.addEventListener('click', exportTurnoResultadoPDF);
  el.exportOcupacaoPdfBtn?.addEventListener('click', exportOcupacaoResumoPDF);
  el.paleteIncompletoToggle?.addEventListener('change', (event) => {
    el.paleteIncompletoFields?.classList.toggle('hidden', !event.target.checked);
  });
  el.estoqueForm.addEventListener('submit', handleEstoqueSubmit);
  el.produtoForm.addEventListener('submit', handleProdutoSubmit);
  el.expedicaoForm?.addEventListener('submit', handleExpedicaoSubmit);
  el.importForm.addEventListener('submit', handleImportSubmit);
  el.adminPasteForm?.addEventListener('submit', handleAdminPasteSubmit);
  el.selectImportBtn?.addEventListener('click', () => el.importFile?.click());
  el.importFile?.addEventListener('change', () => {
    const name = el.importFile.files?.[0]?.name || 'Nenhum arquivo selecionado';
    if (el.importFileName) el.importFileName.textContent = name;
  });
  el.visualizarLayoutBtn?.addEventListener('click', gerarLayoutVisual);
  el.exportLayoutPdfBtn?.addEventListener('click', exportarLayoutPDF);
  el.fecharLayoutBtn?.addEventListener('click', () => el.layoutContainer.classList.add('hidden'));
  el.themeToggleBtn?.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    document.body.classList.toggle('dark', isDark);
    storageSet('wmss_theme', isDark ? 'dark' : 'light');
    el.themeToggleBtn.textContent = isDark ? '☀️ Modo claro' : '🌙 Modo escuro';
  });
  el.autoExportToggle?.addEventListener('change', (event) => {
    const enabled = event.target.checked;
    storageSet('wmss_auto_export', enabled ? '1' : '0');
    showFeedback(enabled ? 'Auto planilha ativado.' : 'Auto planilha desativado.');
  });
  createClient();
}

init();
