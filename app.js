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
    area: String(formData.get('area')).trim().toUpperCase(),
    sku: Number(formData.get('sku')),
    tipo: String(formData.get('tipo')).trim().toUpperCase(),
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

// Lógica de Busca em Tempo Real
document.getElementById('searchInput').addEventListener('keyup', function() {
    const searchTerm = this.value.toLowerCase();
    const tableRows = document.querySelectorAll('#consultaAreaTable tbody tr');

    tableRows.forEach(row => {
        const areaText = row.cells[0].textContent.toLowerCase();
        const skuText = row.cells[1].textContent.toLowerCase();

        // Verifica se o termo buscado está na coluna Área ou na coluna SKU
        if (areaText.includes(searchTerm) || skuText.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


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

async function handleExpedicaoSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) return showFeedback('Conecte ao Supabase primeiro.', 'error');

  const formData = new FormData(event.target);
  const area = String(formData.get('area')).trim().toUpperCase();
  const sku = Number(formData.get('sku'));
  const tipo = String(formData.get('tipo')).trim().toUpperCase();
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

    const { error: movError } = await supabaseClient
      .from('movimentacoes')
      .insert({ sku, tipo, paletes });
    if (movError) throw movError;

    showFeedback('Expedição registrada e estoque atualizado.');
    event.target.reset();
    await loadAll();
  } catch (error) {
    showFeedback(`Erro na expedição: ${error.message}`, 'error');
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
  createClient();
}

init();
