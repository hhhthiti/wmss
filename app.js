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
  estoqueTableBody: document.querySelector('#estoqueTable tbody'),
  consultaAreaBody: document.querySelector('#consultaAreaTable tbody'),
  totaisSkuBody: document.querySelector('#totaisSkuTable tbody'),
  movimentacoesBody: document.querySelector('#movimentacoesTable tbody'),
  exportCadastroBtn: document.getElementById('exportCadastroBtn'),
  exportConsultaBtn: document.getElementById('exportConsultaBtn'),
  exportExpedicaoBtn: document.getElementById('exportExpedicaoBtn')
};

let supabaseClient;
let cache = { estoque: [], movimentacoes: [] };

el.supabaseUrl.value = defaultConfig.url;
el.supabaseKey.value = defaultConfig.key;

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
    area: normalizeText(formData.get('area')),
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
  const area = normalizeText(formData.get('area'));
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
  } catch (error) {
    showFeedback(`Erro na expedição: ${error.message}`, 'error');
  }
}

function mapImportRow(rawRow) {
  const row = Object.fromEntries(
    Object.entries(rawRow).map(([k, v]) => [String(k).trim().toLowerCase(), v])
  );

  return {
    area: normalizeText(row.area),
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
    showFeedback(`Importação concluída. Incluídos/atualizados: ${insertedOrUpdated}. Apagados: ${deleted}.`);
    el.importForm.reset();
  } catch (error) {
    showFeedback(`Erro na importação: ${error.message}`, 'error');
  }
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
  createClient();
}

init();
