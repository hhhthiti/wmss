const defaultConfig = {
  url: 'https://qfjghplxbtogshfjkawx.supabase.co',
  key: 'sb_publishable_rIcKdaflOvJ0DLTJDcOrxA_bpTGG2hA'
};

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
  importFileName: document.getElementById('importFileName'),
  selectImportBtn: document.getElementById('selectImportBtn'),
  estoqueTableBody: document.querySelector('#estoqueTable tbody'),
  consultaAreaBody: document.querySelector('#consultaAreaTable tbody'),
  totaisSkuBody: document.querySelector('#totaisSkuTable tbody'),
  sobrasB01Body: document.querySelector('#sobrasB01Table tbody'),
  planejamentoForm: document.getElementById('planejamentoForm'),
  previsaoEntrada: document.getElementById('previsaoEntrada'),
  planejamentoResultado: document.getElementById('planejamentoResultado'),
  planejamentoBody: document.querySelector('#planejamentoTable tbody'),
  turnoForm: document.getElementById('turnoForm'),
  turnoFile: document.getElementById('turnoFile'),
  turnoStatus: document.getElementById('turnoStatus'),
  turnoSkuBody: document.querySelector('#turnoSkuTable tbody'),
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
  fecharLayoutBtn: document.getElementById('fecharLayoutBtn')
};

let supabaseClient;
let cache = { estoque: [], movimentacoes: [], produtos: [] };
let fracionadoMap = {};
let turnoSnapshots = JSON.parse(localStorage.getItem('wmss_turno_snapshots') || '[]');

const capacidadePlanejamento = {
  A: 80,
  BD: 40,
  BE: 32,
  C: 48
};

const autoExportEnabled = localStorage.getItem('wmss_auto_export') === '1';
if (el.autoExportToggle) el.autoExportToggle.checked = autoExportEnabled;
fracionadoMap = JSON.parse(localStorage.getItem('wmss_fracionado_map') || '{}');

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
  supabaseClient = window.supabase.createClient(defaultConfig.url, defaultConfig.key);
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
    localStorage.setItem('wmss_fracionado_map', JSON.stringify(fracionadoMap));

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
  localStorage.setItem('wmss_turno_snapshots', JSON.stringify(turnoSnapshots));
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

    const snapshotAnterior = turnoSnapshots[0]?.rows ?? null;
    const atual = snapshotAnterior ? consolidarPorChave(snapshotAnterior) : consolidarPorChave(cache.estoque);
    const finalTurno = consolidarPorChave(rows);
    const saidaSkuTipo = {};
    const missing = new Set();

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
  const bPosicoes = Array.from({ length: 13 }, (_, i) => 13 - i);

  const anotacoesA = { 26: 'Bloqueado', 23: 'Bloqueado', 14: 'Recebimento', 1: 'Carregamento' };
  const anotacoesC = { 1: 'Sala ADM', 2: 'Retrabalho' };

  const criarLinha = (prefixo, anotacoes = {}) => {
    const row = document.createElement('div');
    row.className = 'bp-row';

    posicoes.forEach((pos) => {
      const area = `${prefixo}${String(pos).padStart(2, '0')}`;
      const cell = document.createElement('div');
      cell.className = 'bp-cell';
      const texto = getAreaText(area, byArea, anotacoes[pos] || 'Vazio');
      cell.innerHTML = `<strong>${area}</strong><div>${texto}</div>`;
      row.appendChild(cell);
    });

    return row;
  };

  const bRow = document.createElement('div');
  bRow.className = 'bp-row bp-row-b';
  Array.from({ length: 13 }).forEach(() => {
    const empty = document.createElement('div');
    empty.className = 'bp-cell bp-empty';
    bRow.appendChild(empty);
  });

  bPosicoes.forEach((pos) => {
    const areaD = `B${String(pos).padStart(2, '0')}D`;
    const areaE = `B${String(pos).padStart(2, '0')}E`;
    const textoD = getAreaText(areaD, byArea, 'Vazio');
    const textoE = getAreaText(areaE, byArea, 'Vazio');
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
  el.planejamentoForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const itens = parseIncomingForecast(el.previsaoEntrada?.value);
    const totalPrevisto = itens.reduce((acc, item) => acc + item.paletes, 0);
    renderPlanejamentoTable(getPlanejamentoOcupacaoAtual(), totalPrevisto);
  });
}

function init() {
  setupTabs();
  setupExports();
  setupPlanejamento();
  renderTurnoHistory();
  el.turnoForm?.addEventListener('submit', handleTurnoSubmit);
  el.paleteIncompletoToggle?.addEventListener('change', (event) => {
    el.paleteIncompletoFields?.classList.toggle('hidden', !event.target.checked);
  });
  el.estoqueForm.addEventListener('submit', handleEstoqueSubmit);
  el.produtoForm.addEventListener('submit', handleProdutoSubmit);
  el.expedicaoForm?.addEventListener('submit', handleExpedicaoSubmit);
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
