const defaultConfig = {
  url: 'https://qfjghplxbtogshfjkawx.supabase.co',
  key: 'sb_publishable_rIcKdaflOvJ0DLTJDcOrxA_bpTGG2hA'
};

const el = {
  supabaseUrl: document.getElementById('supabaseUrl'),
  supabaseKey: document.getElementById('supabaseKey'),
  connectBtn: document.getElementById('connectBtn'),
  connectionStatus: document.getElementById('connectionStatus'),
  feedback: document.getElementById('feedback'),
  estoqueForm: document.getElementById('estoqueForm'),
  produtoForm: document.getElementById('produtoForm'),
  expedicaoForm: document.getElementById('expedicaoForm'),
  importForm: document.getElementById('importForm'),
  importFile: document.getElementById('importFile'),
  importFileName: document.getElementById('importFileName'),
  selectImportBtn: document.getElementById('selectImportBtn'),
  estoqueTableBody: document.querySelector('#estoqueTable tbody'),
  consultaAreaBody: document.querySelector('#consultaAreaTable tbody'),
  totaisSkuBody: document.querySelector('#totaisSkuTable tbody'),
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
  exportLayoutPdfBtn: document.getElementById('exportLayoutPdfBtn'),
  fecharLayoutBtn: document.getElementById('fecharLayoutBtn')
};

let supabaseClient;
let cache = { estoque: [], movimentacoes: [] };

el.supabaseUrl.value = defaultConfig.url;
el.supabaseKey.value = defaultConfig.key;

const autoExportEnabled = localStorage.getItem('wmss_auto_export') === '1';
if (el.autoExportToggle) el.autoExportToggle.checked = autoExportEnabled;

function setStatus(target, message, type = '') {
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

function shouldDeleteByAction(actionValue) {
  const action = normalizeText(actionValue);
  return ['APAGAR', 'EXCLUIR', 'DELETE', 'DEL', 'REMOVER', 'REMOVE'].includes(action);
}

function createClient() {
  const url = el.supabaseUrl.value.trim();
  const key = el.supabaseKey.value.trim();
  if (!url || !key) {
    setStatus(el.connectionStatus, 'Informe URL e chave para conectar.', 'error');
    return;
  }
  supabaseClient = window.supabase.createClient(url, key);
  setStatus(el.connectionStatus, 'Conectado ao Supabase.', 'success');
  loadAll();
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

async function loadAll() {
  if (!supabaseClient) return;
  try {
    await Promise.all([loadEstoque(), loadMovimentacoes()]);
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

function groupTotalBySku(rows) {
  const totals = rows.reduce((acc, row) => {
    acc[row.sku] = (acc[row.sku] || 0) + Number(row.paletes);
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([sku, total]) => ({ sku: Number(sku), total_paletes: total }))
    .sort((a, b) => a.sku - b.sku);
}

function renderConsulta() {
  el.consultaAreaBody.innerHTML = '';
  cache.estoque.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.area}</td><td>${row.sku}</td><td>${row.tipo}</td><td>${row.paletes}</td>`;
    el.consultaAreaBody.appendChild(tr);
  });

  const totais = groupTotalBySku(cache.estoque);
  el.totaisSkuBody.innerHTML = '';
  totais.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.sku}</td><td>${item.total_paletes}</td>`;
    el.totaisSkuBody.appendChild(tr);
  });
}

function renderMovimentacoes() {
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

  try {
    const { error } = await supabaseClient.from('estoque_area').upsert(payload);
    if (error) throw error;
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

function mapImportRow(rawRow) {
  const row = Object.fromEntries(
    Object.entries(rawRow).map(([k, v]) => [String(k).trim().toLowerCase(), v])
  );

  return {
    area: normalizeAreaCode(row.area),
    sku: Number(row.sku),
    tipo: normalizeText(row.tipo),
    paletes: Number(row.paletes),
    acao: normalizeText(row.acao)
  };
}

function validateImportItem(item, line) {
  if (!item.area) return `Linha ${line}: área inválida`;
  if (!Number.isFinite(item.sku) || item.sku <= 0) return `Linha ${line}: sku inválido`;
  if (!item.tipo) return `Linha ${line}: tipo inválido`;
  if (!Number.isFinite(item.paletes) || item.paletes < 0) return `Linha ${line}: paletes inválido`;
  return null;
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

    if (!rows.length) throw new Error('Planilha vazia.');

    let insertedOrUpdated = 0;
    let deleted = 0;

    for (let i = 0; i < rows.length; i += 1) {
      const item = mapImportRow(rows[i]);
      const error = validateImportItem(item, i + 2);
      if (error) throw new Error(error);

      if (shouldDeleteByAction(item.acao) || item.paletes === 0) {
        const { error: deleteError } = await supabaseClient
          .from('estoque_area')
          .delete()
          .match({ area: item.area, sku: item.sku, tipo: item.tipo });

        if (deleteError) throw new Error(`Linha ${i + 2}: ${deleteError.message}`);
        deleted += 1;
      } else {
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

    await loadEstoque();
    maybeAutoExport();
    showFeedback(`Importação concluída. Incluídos/atualizados: ${insertedOrUpdated}. Apagados: ${deleted}.`);
    el.importForm.reset();
  } catch (error) {
    showFeedback(`Erro na importação: ${error.message}`, 'error');
  }
}


function parseAreaForLayout(areaRaw) {
  const area = normalizeText(areaRaw);
  const normalized = normalizeAreaCode(areaRaw);

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

function gerarLayoutVisual() {
  if (!el.layoutGrid || !el.layoutContainer || !el.estruturasGrid) return;

  el.layoutGrid.innerHTML = '';
  el.estruturasGrid.innerHTML = '';
  const colunas = ['TISSUE', 'C', 'BE', 'BD', 'B', 'A', 'LONIL'];
  const limitePorColuna = {
    TISSUE: 1,
    LONIL: 1
  };

  const parsed = cache.estoque
    .map((item) => ({ item, meta: parseAreaForLayout(item.area) }))
    .filter((entry) => entry.meta);

  const parsedEstruturas = parsed.filter((entry) =>
    (entry.meta.bloco === 'A' && entry.meta.pos <= 5) || entry.meta.bloco === 'TUNEL'
  );
  const parsedLayout = parsed.filter((entry) => !parsedEstruturas.includes(entry));

  colunas.forEach((coluna) => {
    const colunaEl = document.createElement('div');
    colunaEl.className = 'layout-coluna';
    colunaEl.innerHTML = `<h3>${coluna}</h3>`;

    const maiorPosicaoNaColuna = Math.max(
      0,
      ...parsedLayout.filter((entry) => entry.meta.bloco === coluna).map((entry) => entry.meta.pos)
    );

    const minLinha = coluna === 'A' ? 6 : 1;
    const maxLinha = limitePorColuna[coluna] ?? Math.max(12, maiorPosicaoNaColuna, minLinha);

    for (let i = minLinha; i <= maxLinha; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'celula vazio';
      const areaNome = `${coluna}${i}`;

      const itens = parsedLayout
        .filter((entry) => entry.meta.bloco === coluna && entry.meta.pos === i)
        .map((entry) => entry.item);

      let conteudo = `<strong>${areaNome}</strong>`;
      if (itens.length) {
        cell.classList.remove('vazio');
        cell.classList.add('ocupado');

        itens.forEach((item) => {
          const tipoClass = `material-${normalizeText(item.tipo).toLowerCase()}`;
          conteudo += `<div class="sku ${tipoClass}">SKU: ${item.sku}<br />${item.paletes} pal (${item.tipo})</div>`;
        });
      }

      cell.innerHTML = conteudo;
      colunaEl.appendChild(cell);
    }

    el.layoutGrid.appendChild(colunaEl);
  });

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

  const totaisEstoque = groupTotalBySku(cache.estoque);
  const totaisExpedido = groupTotalBySku(cache.movimentacoes);

  exportWorkbook('planilha_espelho_wmss.xlsx', [
    { name: 'Estoque', data: cache.estoque },
    { name: 'Totais_SKU', data: totaisEstoque },
    { name: 'Movimentacoes', data: cache.movimentacoes },
    { name: 'Totais_Expedido_SKU', data: totaisExpedido }
  ]);
}

function maybeAutoExport() {
  if (!el.autoExportToggle?.checked) return;
  exportPlanilhaEspelho();
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
    const totais = groupTotalBySku(cache.estoque);
    exportWorkbook('cadastro_estoque.xlsx', [
      { name: 'Estoque', data: cache.estoque },
      { name: 'Totais_SKU', data: totais }
    ]);
  });

  el.exportConsultaBtn.addEventListener('click', () => {
    const totais = groupTotalBySku(cache.estoque);
    exportWorkbook('consulta_estoque.xlsx', [
      { name: 'Consulta_Areas', data: cache.estoque },
      { name: 'Totais_SKU', data: totais }
    ]);
  });

  el.exportExpedicaoBtn.addEventListener('click', () => {
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

function init() {
  setupTabs();
  setupExports();
  el.connectBtn.addEventListener('click', createClient);
  el.estoqueForm.addEventListener('submit', handleEstoqueSubmit);
  el.produtoForm.addEventListener('submit', handleProdutoSubmit);
  el.expedicaoForm.addEventListener('submit', handleExpedicaoSubmit);
  el.importForm.addEventListener('submit', handleImportSubmit);
  el.selectImportBtn?.addEventListener('click', () => el.importFile?.click());
  el.importFile?.addEventListener('change', () => {
    const name = el.importFile.files?.[0]?.name || 'Nenhum arquivo selecionado';
    if (el.importFileName) el.importFileName.textContent = name;
  });
  el.visualizarLayoutBtn?.addEventListener('click', gerarLayoutVisual);
  el.exportLayoutPdfBtn?.addEventListener('click', exportarLayoutPDF);
  el.fecharLayoutBtn?.addEventListener('click', () => el.layoutContainer.classList.add('hidden'));
  el.autoExportToggle?.addEventListener('change', (event) => {
    const enabled = event.target.checked;
    localStorage.setItem('wmss_auto_export', enabled ? '1' : '0');
    showFeedback(enabled ? 'Auto planilha ativado.' : 'Auto planilha desativado.');
  });
  createClient();
}

init();
