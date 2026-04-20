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
  loginForm: document.getElementById('loginForm'),
  loginUser: document.getElementById('loginUser'),
  loginPass: document.getElementById('loginPass'),
  registerForm: document.getElementById('registerForm'),
  registerUser: document.getElementById('registerUser'),
  registerName: document.getElementById('registerName'),
  registerPass: document.getElementById('registerPass'),
  showLoginBtn: document.getElementById('showLoginBtn'),
  showRegisterBtn: document.getElementById('showRegisterBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  loginStatus: document.getElementById('loginStatus'),
  authScreen: document.getElementById('authScreen'),
  appShell: document.getElementById('appShell'),
  connectionStatus: document.getElementById('connectionStatus'),
  feedback: document.getElementById('feedback'),
  estoqueForm: document.getElementById('estoqueForm'),
  produtoForm: document.getElementById('produtoForm'),
  userForm: document.getElementById('userForm'),
  openLogsBtn: document.getElementById('openLogsBtn'),
  userStatus: document.getElementById('userStatus'),
  usersTableBody: document.querySelector('#usersTable tbody'),
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
  consultaChaoBody: document.querySelector('#consultaChaoTable tbody'),
  consultaSkuAreaBody: document.querySelector('#consultaSkuAreaTable tbody'),
  consultaFilterForm: document.getElementById('consultaFilterForm'),
  consultaDepositoFilter: document.getElementById('consultaDepositoFilter'),
  consultaSideFilter: document.getElementById('consultaSideFilter'),
  consultaSkuSearch: document.getElementById('consultaSkuSearch'),
  consultaMapaBox: document.getElementById('consultaMapaBox'),
  mapaAreaSelect: document.getElementById('mapaAreaSelect'),
  mapaPosicaoInput: document.getElementById('mapaPosicaoInput'),
  exportConsultaResumoPdfBtn: document.getElementById('exportConsultaResumoPdfBtn'),
  totaisSkuBody: document.querySelector('#totaisSkuTable tbody'),
  sobrasB01Body: document.querySelector('#sobrasB01Table tbody'),
  planejamentoForm: document.getElementById('planejamentoForm'),
  previsaoEntrada: document.getElementById('previsaoEntrada'),
  planejamentoFile: document.getElementById('planejamentoFile'),
  planejamentoResultado: document.getElementById('planejamentoResultado'),
  planejamentoEstimateTurnoBtn: document.getElementById('planejamentoEstimateTurnoBtn'),
  aiAssistBtn: document.getElementById('aiAssistBtn'),
  aiAssistPrompt: document.getElementById('aiAssistPrompt'),
  aiAssistStatus: document.getElementById('aiAssistStatus'),
  planejamentoBody: document.querySelector('#planejamentoTable tbody'),
  ocupacaoForm: document.getElementById('ocupacaoForm'),
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
  contagemImportBtn: document.getElementById('contagemImportBtn'),
  contagemClearChecksBtn: document.getElementById('contagemClearChecksBtn'),
  contagemApplyBtn: document.getElementById('contagemApplyBtn'),
  contagemDeleteDbBtn: document.getElementById('contagemDeleteDbBtn'),
  contagemFile: document.getElementById('contagemFile'),
  contagemImportResetToggle: document.getElementById('contagemImportResetToggle'),
  turnoCarryScopes: () => Array.from(document.querySelectorAll('.turno-carry-scope:checked')).map((n) => n.value),
  contagemExportBtn: document.getElementById('contagemExportBtn'),
  contagemStatus: document.getElementById('contagemStatus'),
  contagemBody: document.querySelector('#contagemTable tbody'),
  contagemResumoBody: document.querySelector('#contagemResumoTable tbody'),
  logsBackBtn: document.getElementById('logsBackBtn'),
  logsTableBody: document.querySelector('#logsTable tbody'),
  mb51Status: document.getElementById('mb51Status'),
  mb51TableBody: document.querySelector('#mb51Table tbody'),
  mb51CentrosActions: document.getElementById('mb51CentrosActions'),
  mb52Form: document.getElementById('mb52Form'),
  mb52File: document.getElementById('mb52File'),
  mb52Status: document.getElementById('mb52Status'),
  mb52TableBody: document.querySelector('#mb52Table tbody'),
  mb52RefreshBtn: document.getElementById('mb52RefreshBtn'),
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
let cache = { estoque: [], movimentacoes: [], produtos: [], users: [] };
let fracionadoMap = {};
let turnoSnapshots = [];
let lastTurnoResultado = [];
let turnoUltimaPlanilhaSku = {};
let contagemMap = {};
let mb51Snapshot = [];
let selectedMb51Centro = '';
let mb52LastSkuList = [];
let perfilWriteMode = 'AUTO';
let perfilValuesFromDb = new Set();
let contagemUploadLogs = storageGetJSON('wmss_contagem_upload_logs', []);

const manualOcupados = new Set([
  'A14', 'A15', 'A16', 'A17', 'A18', 'A19',
  'B21D', 'B20D', 'B22D', 'B20E',
  'C15', 'C14', 'C12', 'C11', 'C10', 'C09', 'C08',
  'A09', 'A08', 'A07', 'A06', 'A05', 'A04', 'A03'
]);

const capacidadeGalpoes = {
  principal: 2520,
  tissue: 1728,
  lonil: 1112,
  ttd: 0
};

const ocupacaoRules = {
  larguraPl2: 6,
  profundidade: { A: 5, BD: 5, BE: 4, C: 6 },
  posicoesPorRua: 22,
  interditados: { A: 1, BD: 1, BE: 1, C: 1 }
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

const autoExportEnabled = false;
if (el.autoExportToggle) el.autoExportToggle.checked = autoExportEnabled;
fracionadoMap = {};

const darkModeEnabled = false;
document.body.classList.toggle('dark', darkModeEnabled);
if (el.themeToggleBtn) el.themeToggleBtn.textContent = darkModeEnabled ? '☀️ Modo claro' : '🌙 Modo escuro';


let currentUser = null;

function canAccessRole(requiredRole) {
  if (!requiredRole) return true;
  if (!currentUser) return false;
  if (currentUser.role === 'master') return true;
  const allowed = String(requiredRole)
    .split(/[,\s]+/)
    .map((value) => normalizeText(value).toLowerCase())
    .filter(Boolean);
  return allowed.includes(currentUser.role);
}

function applyRoleVisibility() {
  document.querySelectorAll('[data-role]').forEach((node) => {
    const role = node.getAttribute('data-role');
    node.classList.toggle('hidden-by-role', !canAccessRole(role));
  });
  const visibleTabs = Array.from(document.querySelectorAll('.tab-btn')).filter((btn) => !btn.classList.contains('hidden-by-role'));
  const activeVisible = visibleTabs.find((btn) => btn.classList.contains('active'));
  if (!activeVisible && visibleTabs[0]) visibleTabs[0].click();
}

function toggleAuthMode(mode = 'login') {
  const isLogin = mode === 'login';
  el.loginForm?.classList.toggle('hidden', !isLogin);
  el.registerForm?.classList.toggle('hidden', isLogin);
  el.showLoginBtn?.classList.toggle('secondary', !isLogin);
  el.showRegisterBtn?.classList.toggle('secondary', isLogin);
}

function updateShellVisibility() {
  const loggedIn = Boolean(currentUser);
  el.authScreen?.classList.toggle('hidden', loggedIn);
  el.appShell?.classList.toggle('hidden', !loggedIn);
}

async function authenticateUser(user, pass) {
  if (!user || !pass) return null;

  // Fallback local para não travar operação enquanto a tabela de usuários não é criada.
  if (user === '30152962' && pass === '123') {
    return { usuario: user, perfil: 'MASTER', ativo: true };
  }

  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('wmss_users')
    .select('usuario, perfil, ativo')
    .eq('usuario', user)
    .eq('senha', pass)
    .eq('ativo', true)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

function setupLogin() {
  // Restaura sessão salva no localStorage
  const savedSession = storageGetJSON('wmss_session', null);
  if (savedSession && savedSession.id && savedSession.role) {
    currentUser = savedSession;
  }
  toggleAuthMode('login');
  updateShellVisibility();
  el.showLoginBtn?.addEventListener('click', () => toggleAuthMode('login'));
  el.showRegisterBtn?.addEventListener('click', () => toggleAuthMode('register'));

  el.loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const user = normalizeText(el.loginUser?.value || '');
    const pass = String(el.loginPass?.value || '');
    if (!user || !pass) {
      setStatus(el.loginStatus, 'Informe usuário e senha.', 'error');
      return;
    }

    const auth = await authenticateUser(user, pass);
    if (!auth) {
      setStatus(el.loginStatus, 'Usuário/senha inválidos ou usuário inativo.', 'error');
      return;
    }

    const perfil = normalizePerfilForUI(auth.perfil || 'COMUM');
    currentUser = {
      id: auth.usuario || user,
      role: perfil === 'MASTER' ? 'master' : (perfil === 'ANALISTA' ? 'analyst' : 'common')
    };
    storageSet('wmss_session', JSON.stringify(currentUser));
    const roleLabel = currentUser.role === 'master'
      ? 'mestre'
      : (currentUser.role === 'analyst' ? 'analista' : 'usuário');
    setStatus(el.loginStatus, `Login ${roleLabel} ativo (${currentUser.id}).`, 'success');
    el.loginForm?.reset();
    el.registerForm?.reset();
    updateShellVisibility();
    applyRoleVisibility();
    loadUsers().catch((err) => setStatus(el.userStatus, `Erro ao carregar usuários: ${err.message}`, 'error'));
  });

  el.registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!supabaseClient) return setStatus(el.loginStatus, 'Banco não conectado.', 'error');
    const usuario = normalizeText(el.registerUser?.value || '');
    const nome = String(el.registerName?.value || '').trim();
    const senha = String(el.registerPass?.value || '').trim();

    if (!usuario || !senha) {
      setStatus(el.loginStatus, 'Informe usuário e senha para registrar.', 'error');
      return;
    }

    try {
      let error = null;
      for (const perfilValue of getDbPerfilCandidates('COMUM')) {
        const payload = { usuario, nome, senha, perfil: perfilValue, ativo: true };
        const result = await supabaseClient.from('wmss_users').insert(payload);
        error = result.error || null;
        if (!error) {
          perfilWriteMode = perfilValue === 'COMUM' ? 'UPPER' : 'LOWER';
          break;
        }
        if (!String(error.message || '').includes('wmss_users_perfil_check')) break;
      }
      if (error) throw error;
      setStatus(el.loginStatus, 'Registro criado com perfil COMUM. Faça login para continuar.', 'success');
      el.registerForm?.reset();
      toggleAuthMode('login');
    } catch (error) {
      setStatus(el.loginStatus, `Erro ao registrar usuário: ${error.message}`, 'error');
    }
  });

  el.logoutBtn?.addEventListener('click', () => {
    currentUser = null;
    storageSet('wmss_session', '');
    updateShellVisibility();
    toggleAuthMode('login');
    setStatus(el.loginStatus, 'Sessão encerrada. Faça login para acessar as áreas.', '');
    applyRoleVisibility();
    cache.users = [];
    renderUsersTable();
  });
  applyRoleVisibility();
  updateShellVisibility();
  if (currentUser) {
    setStatus(el.loginStatus, '', '');
  } else {
    setStatus(el.loginStatus, 'Faça login para continuar.', '');
  }
}

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

function normalizePerfilForUI(value) {
  const perfil = normalizeText(value);
  if (['MASTER', 'MESTRE'].includes(perfil)) return 'MASTER';
  if (['ANALISTA', 'ANALYST'].includes(perfil)) return 'ANALISTA';
  return 'COMUM';
}

function buildPerfilCandidates(uiPerfil) {
  const perfil = normalizePerfilForUI(uiPerfil);
  if (perfil === 'MASTER') return ['MASTER', 'master', 'MESTRE', 'mestre'];
  if (perfil === 'ANALISTA') return ['ANALISTA', 'analista', 'ANALYST', 'analyst'];
  return ['COMUM', 'comum', 'USUARIO', 'usuario', 'COMMON', 'common'];
}

function getDbPerfilCandidates(uiPerfil) {
  const normalizedTarget = normalizePerfilForUI(uiPerfil);
  const detected = [...perfilValuesFromDb].filter(Boolean);
  if (!detected.length) return buildPerfilCandidates(normalizedTarget);
  const compatible = detected.filter((value) => normalizePerfilForUI(value) === normalizedTarget);
  return compatible.length ? compatible : buildPerfilCandidates(normalizedTarget);
}

function addContagemUploadLog(rows = []) {
  const payloadRows = (rows || []).map((row) => ({
    area: normalizeAreaCode(row.area),
    sku: Number(row.sku),
    tipo: normalizeText(row.tipo),
    paletes: Number(row.paletes || 0)
  })).filter((row) => row.area && row.sku && row.paletes > 0);

  const entry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    usuario: currentUser?.id || 'DESCONHECIDO',
    rows: payloadRows
  };
  contagemUploadLogs.unshift(entry);
  contagemUploadLogs = contagemUploadLogs.slice(0, 500);
  storageSet('wmss_contagem_upload_logs', JSON.stringify(contagemUploadLogs));
  renderLogsTable();
}

function exportContagemLogEntry(entryId) {
  const entry = (contagemUploadLogs || []).find((item) => item.id === entryId);
  if (!entry) return showFeedback('Log não encontrado.', 'error');
  const rows = (entry.rows || []).map((row) => ({
    data_hora: entry.created_at,
    usuario: entry.usuario,
    area: row.area,
    sku: row.sku,
    tipo: row.tipo,
    paletes: row.paletes
  }));
  if (!rows.length) return showFeedback('Esse log não possui linhas para exportar.', 'error');
  exportWorkbook(`contagem_${entry.usuario}_${entry.created_at.replace(/[:.]/g, '-')}.xlsx`, [
    { name: 'Contagem', data: rows }
  ]);
}

function renderLogsTable() {
  if (!el.logsTableBody) return;
  el.logsTableBody.innerHTML = '';
  (contagemUploadLogs || []).forEach((entry) => {
    const tr = document.createElement('tr');
    const created = new Date(entry.created_at);
    tr.innerHTML = `
      <td>${Number.isNaN(created.getTime()) ? entry.created_at : created.toLocaleString('pt-BR')}</td>
      <td>${entry.usuario || '-'}</td>
      <td>${(entry.rows || []).length}</td>
      <td><button type="button" class="secondary" data-log-export="${entry.id}">Baixar cópia</button></td>
    `;
    tr.querySelector('[data-log-export]')?.addEventListener('click', () => exportContagemLogEntry(entry.id));
    el.logsTableBody.appendChild(tr);
  });
  if (!contagemUploadLogs.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="4">Sem logs de contagem até o momento.</td>';
    el.logsTableBody.appendChild(tr);
  }
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

function normalizeHeaderKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[._-]+/g, ' ')
    .toLowerCase()
    .trim();
}

function toNumberFlexible(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  const raw = String(value ?? '').trim().replace(/\./g, '').replace(',', '.');
  if (!raw) return NaN;
  const num = Number(raw);
  return Number.isFinite(num) ? num : NaN;
}

function normalizeMaterialCode(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return '';
  const noLeadingZero = digits.replace(/^0+/, '');
  return noLeadingZero || '0';
}

function formatFardos(value) {
  const quantity = Number(value || 0);
  return `${quantity.toLocaleString('pt-BR')} fardos`;
}

function mapMb51Row(rawRow) {
  const row = Object.fromEntries(
    Object.entries(rawRow || {}).map(([k, v]) => [normalizeHeaderKey(k), v])
  );
  const material = normalizeMaterialCode(row.material);
  const descricao = String(row['texto breve material'] ?? row.descricao ?? '').trim();
  const centro = normalizeText(row.centro);
  const utilizacaoLivre = toNumberFlexible(row['utilizacao livre'] ?? row['utilização livre']);
  return { material, descricao, centro, utilizacaoLivre };
}

function saveMb51Snapshot(rows) {
  mb51Snapshot = rows;
  storageSet('wmss_mb51_snapshot', JSON.stringify(rows));
}

function loadMb51Snapshot() {
  const saved = storageGetJSON('wmss_mb51_snapshot', []);
  mb51Snapshot = Array.isArray(saved) ? saved : [];
}



function getMb51Centros() {
  return [...new Set(mb51Snapshot
    .map((row) => normalizeText(row.centro))
    .filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
}

function renderMb51CenterButtons() {
  if (!el.mb51CentrosActions) return;
  const centros = getMb51Centros();
  el.mb51CentrosActions.innerHTML = '';
  if (!centros.length) {
    const hint = document.createElement('span');
    hint.className = 'helper-text';
    hint.textContent = 'Sem centros carregados na base MB51.';
    el.mb51CentrosActions.appendChild(hint);
    return;
  }

  centros.forEach((centro) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `secondary${selectedMb51Centro === centro ? ' active' : ''}`;
    btn.textContent = `Pesquisar centro ${centro}`;
    btn.addEventListener('click', () => renderMb51Table(centro));
    el.mb51CentrosActions.appendChild(btn);
  });
}
function renderMb51Table(centro) {
  if (!el.mb51TableBody) return;
  const centros = getMb51Centros();
  const fallbackCentro = centros[0] || '';
  selectedMb51Centro = centro || selectedMb51Centro || fallbackCentro;
  renderMb51CenterButtons();
  el.mb51TableBody.innerHTML = '';
  const filtered = mb51Snapshot
    .filter((row) => row.centro === selectedMb51Centro && row.material)
    .sort((a, b) => a.material.localeCompare(b.material, 'pt-BR', { numeric: true }));

  if (!filtered.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4">Nenhum material encontrado para o centro ${selectedMb51Centro || '-' }.</td>`;
    el.mb51TableBody.appendChild(tr);
    return;
  }

  filtered.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.centro}</td>
      <td>${row.material}</td>
      <td>${row.descricao || '-'}</td>
      <td>${formatFardos(row.utilizacaoLivre)}</td>
    `;
    el.mb51TableBody.appendChild(tr);
  });
}

function getSistemaTotalsBySku() {
  const totals = {};
  (cache.estoque || []).forEach((row) => {
    const sku = normalizeMaterialCode(row?.sku);
    if (!sku) return;
    const paletes = Number(row?.paletes || 0);
    if (!Number.isFinite(paletes) || paletes <= 0) return;
    const fpp = getFardosPorPalete(sku);
    if (!Number.isFinite(fpp) || fpp <= 0) return;
    totals[sku] = (totals[sku] || 0) + (paletes * fpp);
  });
  return totals;
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


function buildAiAssistContext() {
  const ocupado = getPlanejamentoOcupacaoAtual();
  const ocupacaoSetores = getPaletesResumoPorSetor();
  const topSkus = groupTotalBySku(cache.estoque, { excludeRetrabalho: true }).slice(0, 30);
  return {
    capacidadePlanejamento,
    ocupado,
    ocupacaoSetores,
    topSkus,
    dataHora: new Date().toISOString()
  };
}

async function runAiAssist() {
  const prompt = String(el.aiAssistPrompt?.value || '').trim();
  if (!prompt) {
    setStatus(el.aiAssistStatus, 'Escreva uma pergunta para a IA.', 'error');
    return;
  }

  setStatus(el.aiAssistStatus, 'Consultando IA...', '');
  const payload = { prompt, context: buildAiAssistContext() };

  try {
    const response = await fetch(`${defaultConfig.url}/functions/v1/wmss-ai-assist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: defaultConfig.key,
        Authorization: `Bearer ${defaultConfig.key}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || `Falha HTTP ${response.status}`);
    }

    const data = await response.json();
    const answer = String(data?.answer || data?.resposta || '').trim();
    if (!answer) throw new Error('Resposta vazia da função wmss-ai-assist.');
    setStatus(el.aiAssistStatus, answer, 'success');
  } catch (error) {
    setStatus(
      el.aiAssistStatus,
      `Não foi possível consultar a IA agora. Verifique se a Edge Function "wmss-ai-assist" está publicada. Detalhe: ${error.message}`,
      'error'
    );
  }
}



function renderUsersTable() {
  if (!el.usersTableBody) return;
  el.usersTableBody.innerHTML = '';
  cache.users.forEach((u) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.usuario}</td><td>${u.nome || ''}</td><td>${u.perfil}</td><td>${u.ativo ? 'SIM' : 'NÃO'}</td><td><button type="button" class="secondary" data-edit="${u.usuario}">Editar</button></td>`;
    tr.querySelector('[data-edit]')?.addEventListener('click', () => {
      if (!el.userForm) return;
      el.userForm.usuario.value = u.usuario || '';
      el.userForm.nome.value = u.nome || '';
      el.userForm.senha.value = '';
      el.userForm.perfil.value = normalizePerfilForUI(u.perfil || 'COMUM');
      el.userForm.ativo.checked = Boolean(u.ativo);
      setStatus(el.userStatus, `Editando usuário ${u.usuario}. Preencha a senha somente se quiser alterá-la.`, '');
    });
    el.usersTableBody.appendChild(tr);
  });
}

async function loadUsers() {
  if (!supabaseClient || !currentUser || currentUser.role !== 'master') {
    cache.users = [];
    renderUsersTable();
    return;
  }
  const { data, error } = await supabaseClient
    .from('wmss_users')
    .select('usuario, nome, perfil, ativo')
    .order('usuario', { ascending: true });
  if (error) throw error;
  cache.users = data ?? [];
  perfilValuesFromDb = new Set((cache.users || []).map((u) => String(u?.perfil || '').trim()).filter(Boolean));
  renderUsersTable();
}

async function handleUserSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) return setStatus(el.userStatus, 'Banco não conectado.', 'error');
  if (!currentUser || currentUser.role !== 'master') return setStatus(el.userStatus, 'Somente mestre pode cadastrar usuários.', 'error');

  const formData = new FormData(event.target);
  const usuario = normalizeText(formData.get('usuario'));
  const nome = String(formData.get('nome') || '').trim();
  const senha = String(formData.get('senha') || '').trim();
  const perfil = normalizePerfilForUI(formData.get('perfil') || 'COMUM');
  const ativo = formData.get('ativo') === 'on';

  const isUpdate = cache.users.some((u) => normalizeText(u.usuario) === usuario);
  if (!usuario || (!isUpdate && !senha)) return setStatus(el.userStatus, 'Informe usuário e senha para novo cadastro.', 'error');
  if (!['MASTER', 'COMUM', 'ANALISTA'].includes(perfil)) return setStatus(el.userStatus, 'Perfil inválido.', 'error');

  const baseCandidates = getDbPerfilCandidates(perfil);
  if (!baseCandidates.length) {
    return setStatus(el.userStatus, `Perfil ${perfil} não está habilitado na regra atual do banco.`, 'error');
  }
  const perfilCandidates = perfilWriteMode === 'LOWER'
    ? [...baseCandidates.filter((v) => v === v.toLowerCase()), ...baseCandidates]
    : (perfilWriteMode === 'UPPER'
      ? [...baseCandidates.filter((v) => v === v.toUpperCase()), ...baseCandidates]
      : baseCandidates);

  try {
    let lastError = null;
    for (const perfilValue of perfilCandidates) {
      const payload = { usuario, nome, perfil: perfilValue, ativo };
      if (senha) payload.senha = senha;
      const { error } = await supabaseClient
        .from('wmss_users')
        .upsert(payload, { onConflict: 'usuario' });
      if (!error) {
        perfilWriteMode = perfilValue === perfilValue.toUpperCase() ? 'UPPER' : 'LOWER';
        perfilValuesFromDb.add(perfilValue);
        lastError = null;
        break;
      }
      lastError = error;
      if (!String(error.message || '').includes('wmss_users_perfil_check')) break;
    }
    if (lastError) throw lastError;
    event.target.reset();
    if (event.target.ativo) event.target.ativo.checked = true;
    await loadUsers();
    setStatus(el.userStatus, 'Usuário salvo com sucesso.', 'success');
  } catch (error) {
    if (String(error.message || '').includes('wmss_users_perfil_check')) {
      setStatus(el.userStatus, `Erro ao salvar usuário: perfil não aceito pela regra do banco (${perfil}).`, 'error');
      return;
    }
    setStatus(el.userStatus, `Erro ao salvar usuário: ${error.message}`, 'error');
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
    await Promise.all([loadEstoque(), loadMovimentacoes(), loadProdutos(), loadUsers()]);
    if (currentUser) {
      applyRoleVisibility();
      showFeedback('Dados carregados com sucesso.');
    }
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

function getDepositoFromArea(area) {
  const a = normalizeAreaCode(area);
  if (a.startsWith('TISSUE')) return 'TISSUE';
  if (a.startsWith('TTD')) return 'TTD';
  if (a.startsWith('LONIL')) return 'LONIL';
  if (/^(R\d+\.\d+|CHAOESTRUTURA)$/.test(a)) return 'ESTRUTURA';
  return 'PRINCIPAL';
}

function getSideFromArea(area) {
  const a = normalizeAreaCode(area);
  if (a.endsWith('D')) return 'D';
  if (a.endsWith('E')) return 'E';
  return 'ALL';
}

function sideLabel(side) {
  if (side === 'D') return '→ Direita';
  if (side === 'E') return '← Esquerda';
  return '—';
}

function filterConsultaRows(rows) {
  const deposito = normalizeText(el.consultaDepositoFilter?.value || 'ALL');
  const side = normalizeText(el.consultaSideFilter?.value || 'ALL');
  const skuSearch = normalizeText(el.consultaSkuSearch?.value || '');
  return rows.filter((row) => {
    const dep = getDepositoFromArea(row.area);
    const rowSide = getSideFromArea(row.area);
    const depositoOk = deposito === 'ALL' ? true : dep === deposito;
    const sideOk = side === 'ALL' ? true : rowSide === side;
    const skuOk = !skuSearch || normalizeText(row.sku).includes(skuSearch);
    return depositoOk && sideOk && skuOk;
  });
}

function renderConsultaSkuArea(rowsFiltrados) {
  if (!el.consultaSkuAreaBody) return;
  const grouped = {};
  rowsFiltrados.forEach((row) => {
    const dep = getDepositoFromArea(row.area);
    const key = `${dep}|${row.sku}`;
    if (!grouped[key]) grouped[key] = { dep, sku: row.sku, paletes: 0, fardos: 0, missingFpp: false };
    grouped[key].paletes += Number(row.paletes || 0);
    const fpp = getFardosPorPalete(row.sku);
    if (fpp) grouped[key].fardos += Number(row.paletes || 0) * fpp;
    else grouped[key].missingFpp = true;
  });
  el.consultaSkuAreaBody.innerHTML = '';
  Object.values(grouped)
    .sort((a, b) => a.dep.localeCompare(b.dep) || Number(a.sku) - Number(b.sku))
    .forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${item.dep}</td><td>${item.sku}</td><td>${item.paletes}</td><td>${item.missingFpp ? 'N/D' : item.fardos}</td>`;
      el.consultaSkuAreaBody.appendChild(tr);
    });
}

function renderConsultaChao(rowsFiltrados) {
  if (!el.consultaChaoBody) return;
  el.consultaChaoBody.innerHTML = '';
  const chaoRows = rowsFiltrados.filter((row) => normalizeAreaCode(row.area).includes('CHAO'));
  chaoRows.forEach((row) => {
    const dep = getDepositoFromArea(row.area);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>Chão ${dep}</td><td>${sideLabel(getSideFromArea(row.area))}</td><td>${row.area}</td><td>${row.sku}</td><td>${row.paletes}</td>`;
    el.consultaChaoBody.appendChild(tr);
  });
  if (!chaoRows.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="5">Sem registros de chão no filtro atual.</td>';
    el.consultaChaoBody.appendChild(tr);
  }
}

function renderConsultaMapaHint() {
  if (!el.consultaMapaBox) return;
  const area = normalizeText(el.mapaAreaSelect?.value || 'PRINCIPAL');
  const pos = normalizeAreaCode(el.mapaPosicaoInput?.value || '');
  const side = sideLabel(getSideFromArea(pos));
  const deposito = area === 'TTD' ? 'TDD' : area;
  el.consultaMapaBox.textContent = pos
    ? `Você está aqui: ${pos} | Depósito: ${deposito} | Lado: ${side}. Siga para o blocado indicado e confirme o endereço no sentido da seta.`
    : `Selecione área e informe uma posição para orientação visual (ex.: B02D → Direita, B02E ← Esquerda).`;
}

function renderConsulta() {
  const rowsFiltrados = filterConsultaRows(cache.estoque);
  if (!el.consultaAreaBody) return;
  el.consultaAreaBody.innerHTML = '';
  rowsFiltrados.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${getDepositoFromArea(row.area)}</td><td>${sideLabel(getSideFromArea(row.area))}</td><td>${row.area}</td><td>${row.sku}</td><td>${row.tipo}</td><td>${row.paletes}</td>`;
    el.consultaAreaBody.appendChild(tr);
  });

  if (!rowsFiltrados.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="6">Nenhum resultado para os filtros atuais.</td>';
    el.consultaAreaBody.appendChild(tr);
  }

  if (el.totaisSkuBody) {
    const totais = groupTotalBySku(rowsFiltrados, { excludeRetrabalho: true });
    el.totaisSkuBody.innerHTML = '';
    totais.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${item.sku}</td><td>${item.total_paletes}</td>`;
      el.totaisSkuBody.appendChild(tr);
    });
  }

  renderSobrasB01();
  renderConsultaChao(rowsFiltrados);
  renderConsultaSkuArea(rowsFiltrados);
  renderConsultaMapaHint();
  renderPlanejamentoTable(getPlanejamentoOcupacaoAtual(), 0);
  renderOcupacao();
}

function inferContagemScopeFromPosicao(posicao) {
  const p = normalizeAreaCode(posicao);
  if (/^A\d+$/.test(p)) return 'A';
  if (/^B\d+[ED]?$/.test(p) || /^BD\d+$/.test(p) || /^BE\d+$/.test(p)) return 'B';
  if (/^C\d+$/.test(p)) return 'C';
  if (p.startsWith('CHAO_')) return 'CHAO';
  if (/^(R\d+\.\d+|CHAOESTRUTURA)$/.test(p)) return 'ESTRUTURA';
  if (p.startsWith('TISSUE')) return 'TISSUE';
  if (p.startsWith('LONIL')) return 'LONIL';
  if (p.startsWith('TTD')) return 'TTD';
  return null;
}

function getOccupiedByWarehouse() {
  const fromEstoque = { principal: 0, tissue: 0, lonil: 0, ttd: 0 };
  cache.estoque.forEach((row) => {
    const area = normalizeAreaCode(row.area);
    const pal = Number(row.paletes || 0);
    if (/^TISSUE\d+[ED]?$/.test(area)) {
      fromEstoque.tissue += pal;
    } else if (/^LONIL\d+[ED]?$/.test(area)) {
      fromEstoque.lonil += pal;
    } else if (/^TTD\d+[ED]?$/.test(area)) {
      fromEstoque.ttd += pal;
    } else if (/^(A|B|C)\d+[ED]?$/.test(area)) {
      fromEstoque.principal += pal;
    }
  });

  const fromContagem = { principal: 0, tissue: 0, lonil: 0, ttd: 0, linhas: 0 };
  Object.entries(contagemMap || {}).forEach(([posicao, rawEntries]) => {
    const scope = inferContagemScopeFromPosicao(posicao);
    if (!scope) return;
    const entries = Array.isArray(rawEntries) ? rawEntries : (rawEntries ? [rawEntries] : []);
    entries.forEach((entry) => {
      const result = computeContagem(posicao, entry, scope);
      if (result.paletes <= 0) return;
      if (['A', 'B', 'C'].includes(scope)) fromContagem.principal += Number(result.paletes || 0);
      else if (scope === 'TISSUE') fromContagem.tissue += Number(result.paletes || 0);
      else if (scope === 'LONIL') fromContagem.lonil += Number(result.paletes || 0);
      else if (scope === 'TTD') fromContagem.ttd += Number(result.paletes || 0);
      else if (scope === 'CHAO') {
        const pos = normalizeAreaCode(posicao);
        if (pos.includes('TISSUE')) fromContagem.tissue += Number(result.paletes || 0);
        else if (pos.includes('TTD')) fromContagem.ttd += Number(result.paletes || 0);
        else if (pos.includes('LONIL')) fromContagem.lonil += Number(result.paletes || 0);
        else fromContagem.principal += Number(result.paletes || 0);
      }
      fromContagem.linhas += 1;
    });
  });

  const useContagem = fromContagem.linhas > 0;
  return {
    principal: useContagem ? fromContagem.principal : fromEstoque.principal,
    tissue: useContagem ? fromContagem.tissue : fromEstoque.tissue,
    lonil: useContagem ? fromContagem.lonil : fromEstoque.lonil,
    ttd: useContagem ? fromContagem.ttd : fromEstoque.ttd,
    source: useContagem ? 'contagem' : 'sistema'
  };
}

function getPrincipalCapacidadePelasRegras() {
  const calc = (bloco) => {
    const posicoesUteis = Math.max(0, ocupacaoRules.posicoesPorRua - Number(ocupacaoRules.interditados[bloco] || 0));
    return posicoesUteis * ocupacaoRules.larguraPl2 * Number(ocupacaoRules.profundidade[bloco] || 0);
  };
  return calc('A') + calc('BD') + calc('BE') + calc('C');
}

function getPaletesResumoPorSetor() {
  const { principal, tissue, lonil, ttd } = getOccupiedByWarehouse();
  return { principal, tissue, lonil, ttd };
}

function exportOcupacaoResumoPDF() {
  if (!window.jspdf) return showFeedback('Biblioteca de PDF não carregada.', 'error');
  const resumo = getPaletesResumoPorSetor();
  const linhas = [
    ['Principal (Ruas A/B/C + Estruturas)', resumo.principal],
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

  const { principal, tissue, lonil, ttd, source } = getOccupiedByWarehouse();
  const data = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const cap = { g1: 4402, g2: 2520, g3: 1771, g4: 846 };
  const terceiros = { g1: 856, g2: 0, g3: 521, g4: 846 };
  const dispTotal = {
    g1: cap.g1 - terceiros.g1,
    g2: cap.g2 - terceiros.g2,
    g3: cap.g3 - terceiros.g3,
    g4: cap.g4 - terceiros.g4
  };
  const ocupadoJsl = { g1: principal, g2: tissue, g3: lonil, g4: ttd };
  const dispJsl = {
    g1: dispTotal.g1 - ocupadoJsl.g1,
    g2: dispTotal.g2 - ocupadoJsl.g2,
    g3: dispTotal.g3 - ocupadoJsl.g3,
    g4: dispTotal.g4 - ocupadoJsl.g4
  };
  const capacidadeFardos = 350000;
  const qtdFardos = cache.estoque.reduce((acc, row) => {
    const fpp = getFardosPorPalete(row.sku);
    return acc + (fpp ? (Number(row.paletes || 0) * fpp) : 0);
  }, 0);

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${data}</td><td>${cap.g1}</td><td>${terceiros.g1}</td><td>${dispTotal.g1}</td><td>${ocupadoJsl.g1}</td><td>${dispJsl.g1}</td>
    <td>${data}</td><td>${cap.g2}</td><td>${terceiros.g2}</td><td>${dispTotal.g2}</td><td>${ocupadoJsl.g2}</td><td>${dispJsl.g2}</td>
    <td>${data}</td><td>${cap.g3}</td><td>${terceiros.g3}</td><td>${dispTotal.g3}</td><td>${ocupadoJsl.g3}</td><td>${dispJsl.g3}</td>
    <td>${data}</td><td>${cap.g4}</td><td>${terceiros.g4}</td><td>${dispTotal.g4}</td><td>${ocupadoJsl.g4}</td><td>${dispJsl.g4}</td>
    <td>${capacidadeFardos}</td><td>${qtdFardos.toLocaleString('pt-BR')}</td>
  `;
  el.ocupacaoBody.appendChild(tr);

  setStatus(el.ocupacaoStatus, source === 'contagem'
    ? 'Ocupação atualizada pela Contagem (layout em linha reta G1/G2/G3/G4).'
    : 'Ocupação atualizada com dados do sistema (layout em linha reta G1/G2/G3/G4).', 'success');
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
  'R5.01-09', 'R5.10-16', 'R6.01-10', 'R6.11-16', 'R1.08-13', 'R2.10-16', 'TUNEL', 'CHAO ESTRUTURA'
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
  return ['B', 'TISSUE', 'TTD', 'LONIL', 'CHAO'].includes(scope);
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
  if (s === 'CHAO') {
    if (side === 'D') return ['CHAO_PRINCIPAL_D', 'CHAO_TISSUE_D', 'CHAO_TTD_D', 'CHAO_LONIL_D'];
    if (side === 'E') return ['CHAO_PRINCIPAL_E', 'CHAO_TISSUE_E', 'CHAO_TTD_E', 'CHAO_LONIL_E'];
    return ['CHAO_PRINCIPAL_D', 'CHAO_PRINCIPAL_E', 'CHAO_TISSUE_D', 'CHAO_TISSUE_E', 'CHAO_TTD_D', 'CHAO_TTD_E', 'CHAO_LONIL_D', 'CHAO_LONIL_E'];
  }
  if (['TISSUE', 'TTD', 'LONIL'].includes(s)) {
    const fromDb = cache.estoque
      .map((row) => normalizeAreaCode(row.area))
      .filter((area) => area.startsWith(s));
    const fromContagem = Object.keys(contagemMap || {})
      .map((area) => normalizeAreaCode(area))
      .filter((area) => area.startsWith(s));
    const maxPos = fromDb.reduce((max, area) => {
      const m = area.match(/^(?:TISSUE|TTD|LONIL)(\d+)/);
      return m ? Math.max(max, Number(m[1])) : max;
    }, fromContagem.reduce((max, area) => {
      const m = area.match(/^(?:TISSUE|TTD|LONIL)(\d+)/);
      return m ? Math.max(max, Number(m[1])) : max;
    }, 0));
    const qty = Math.max(maxPos || 0, 80);
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
    terceiraCamada: Boolean(item.terceiraCamada),
    paletesTerceira: Number(item.paletesTerceira || 0),
    fardosFaltando: Number(item.fardosFaltando || 0),
    totalManual: Number(item.totalManual || 0),
    usarTotalManual: Boolean(item.usarTotalManual),
    blocadoPresente: typeof item.blocadoPresente === 'boolean' ? item.blocadoPresente : true,
    confirmada: Boolean(item.confirmada),
    tipoPlt: normalizeText(item.tipoPlt)
  }));
}

function createEmptyContagemEntry() {
  return {
    sku: '',
    profundidade1: 0,
    largura1: 0,
    terceiraCamada: false,
    paletesTerceira: 0,
    fardosFaltando: 0,
    totalManual: 0,
    usarTotalManual: false,
    blocadoPresente: true,
    confirmada: false,
    tipoPlt: ''
  };
}

function saveContagemEntries(posicao, entries) {
  const normalized = entries.map((entry) => ({
    ...createEmptyContagemEntry(),
    ...entry
  }));
  contagemMap[posicao] = normalized;
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
  const ativo = st.blocadoPresente !== false;
  if (!ativo) {
    const paletes = st.usarTotalManual && Number(st.totalManual) > 0 ? Number(st.totalManual) : 0;
    const fpp = getFardosPorPalete(st.sku);
    const faltando = Math.max(0, st.fardosFaltando || 0);
    const fardosBrutos = fpp ? paletes * fpp : null;
    const fardos = Number.isFinite(fardosBrutos) ? Math.max(0, fardosBrutos - faltando) : null;
    return { ...st, posicao, paletes, paletesCalculados: 0, fardos };
  }
  const basePrimeira = Math.max(0, st.profundidade1 * st.largura1);
  const base = isEstrutura ? (normalizeText(st.sku) ? 1 : 0) : basePrimeira;
  const terceira = st.terceiraCamada ? Math.max(0, st.paletesTerceira) : 0;
  const paletesCalculados = base + terceira;
  const paletes = st.usarTotalManual && Number(st.totalManual) > 0 ? Number(st.totalManual) : paletesCalculados;
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
  const terceira = Math.max(0, total - capacidadeCamada);

  const toDepthWidth = (qty) => {
    if (qty <= 0) return { profundidade: 0, largura: 0 };
    const profundidade = Math.min(5, qty);
    const largura = Math.min(3, Math.ceil(qty / profundidade));
    return { profundidade, largura };
  };

  const c1 = toDepthWidth(primeira);
  return {
    profundidade1: c1.profundidade,
    largura1: c1.largura,
    terceiraCamada: terceira > 0,
    paletesTerceira: terceira
  };
}

function hasManualContagemData(entry) {
  return Boolean(
    normalizeText(entry?.sku)
    || Number(entry?.totalManual) > 0
    || Number(entry?.profundidade1) > 0
    || Number(entry?.largura1) > 0
    || Number(entry?.paletesTerceira) > 0
    || Boolean(entry?.usarTotalManual)
    || Number(entry?.fardosFaltando) > 0
  );
}

function estimateContagemFromTurno(scope, side = 'ALL') {
  const skuTotals = turnoUltimaPlanilhaSku || {};
  const skusDisponiveis = Object.keys(skuTotals).filter((sku) => Number(skuTotals[sku]) > 0);
  if (!skusDisponiveis.length) return 0;

  const positions = getContagemPositions(scope, side);
  const carryScopes = (el.turnoCarryScopes?.() || []).filter((v) => v !== scope);
  const targetsBySku = {};
  positions.forEach((posicao) => {
    const entries = getContagemEntries(posicao);
    entries.forEach((entry, idx) => {
      const sku = normalizeText(entry.sku);
      if (!sku || !Number(skuTotals[sku])) return;
      if (hasManualContagemData(entry)) return;
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
      current.usarTotalManual = true;
      if (normalizeText(scope) !== 'ESTRUTURA') Object.assign(current, estimateLayersFromTotal(total));
      entries[target.idx] = current;
      saveContagemEntries(target.posicao, entries);
      estimadas += 1;
    });
  });

  return estimadas;
}

async function importContagemFromPlanilha() {
  const file = el.contagemFile?.files?.[0];
  if (!file) return setStatus(el.contagemStatus, 'Selecione a planilha para pré-preencher a contagem.', 'error');

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    const scope = el.contagemScope?.value;
    const positionsAll = new Set(['A', 'B', 'C', 'ESTRUTURA', 'CHAO', 'TISSUE', 'LONIL', 'TTD']
      .flatMap((s) => getContagemPositions(s, 'ALL')));
    const normalizeHeader = (key) => String(key || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const parseDepositoScope = (deposito) => {
      const dep = normalizeText(deposito);
      if (!dep) return '';
      if (dep.includes('ESTRUT')) return 'ESTRUTURA';
      if (dep.includes('CHAO')) return 'CHAO';
      if (dep.includes('TISSUE') || dep.includes('TSUI')) return 'TISSUE';
      if (dep.includes('LONIL')) return 'LONIL';
      if (dep.includes('TTD') || dep.includes('TTT')) return 'TTD';
      if (dep.includes('PRINCIPAL')) return 'PRINCIPAL';
      return '';
    };

    const planRows = rawRows
      .map((raw) => {
        const row = Object.fromEntries(Object.entries(raw).map(([k, v]) => [normalizeHeader(k), v]));
        return {
          deposito: normalizeText(row.deposito ?? row.setor ?? row.rua ?? row.area_contagem),
          quadrante: normalizeText(row.quadrante ?? row.area ?? row.posicao ?? row.endereco),
          area: normalizeAreaCode(row.quadrante ?? row.area ?? row.posicao ?? row.endereco),
          sku: Number(row.sku ?? row.codsku ?? row.cod_sku),
          paletes: Number(row.qtd_plt ?? row['qtd plt'] ?? row.paletes ?? row.pallets ?? row.quantidade),
          tipoPlt: normalizeText(row.tipo_plt ?? row['tipo plt'] ?? row.tipo),
          lado: normalizeText(row.lado ?? row.side),
          setor: normalizeText(row.setor ?? row.rua ?? row.area_contagem)
        };
      })
      .filter((row) => Number.isFinite(row.sku) && row.paletes > 0)
      .map((row) => ({ ...row, depositoScope: parseDepositoScope(row.deposito) }));

    const autoIndex = {};
    const validRows = planRows
      .map((row) => {
        let area = normalizeAreaCode(row.area);
        if (['D', 'E', 'DIREITO', 'ESQUERDO'].includes(area)) area = '';
        let guessScope = row.depositoScope;
        if (!guessScope && /^A\d+/.test(area)) guessScope = 'A';
        if (!guessScope && /^B\d+[DE]?$/.test(area)) guessScope = 'B';
        if (!guessScope && /^C\d+/.test(area)) guessScope = 'C';
        if (!guessScope && area.startsWith('TISSUE')) guessScope = 'TISSUE';
        if (!guessScope && area.startsWith('LONIL')) guessScope = 'LONIL';
        if (!guessScope && area.startsWith('TTD')) guessScope = 'TTD';
        if (!guessScope && /^(R\d+\.\d+|CHAOESTRUTURA)$/.test(area)) guessScope = 'ESTRUTURA';
        if (!guessScope && (row.quadrante.includes('CHAO') || area.startsWith('CHAO'))) guessScope = 'CHAO';

        if (guessScope === 'ESTRUTURA' && !/^(R\d+\.\d+|CHAOESTRUTURA|TUNEL)$/.test(area)) {
          const expanded = expandRangeLabel(row.quadrante || row.area || '');
          if (expanded?.length) area = normalizeAreaCode(expanded[0]);
        }

        if (guessScope === 'CHAO' && !area.startsWith('CHAO_')) {
          const sideFromQuadrante = row.quadrante.includes('DIREIT') ? 'D' : (row.quadrante.includes('ESQUERD') ? 'E' : 'D');
          let dep = 'LONIL';
          if (row.depositoScope === 'PRINCIPAL' || row.deposito.includes('PRINCIPAL')) dep = 'PRINCIPAL';
          else if (row.depositoScope === 'TISSUE' || row.deposito.includes('TISSUE') || row.deposito.includes('TSUI')) dep = 'TISSUE';
          else if (row.depositoScope === 'TTD' || row.deposito.includes('TTD') || row.deposito.includes('TTT')) dep = 'TTD';
          else if (row.depositoScope === 'LONIL' || row.deposito.includes('LONIL')) dep = 'LONIL';
          area = `CHAO_${dep}_${sideFromQuadrante}`;
        }

        if (!area && ['TISSUE', 'TTD', 'LONIL'].includes(guessScope)) {
          const sideFromQuadrante = row.quadrante.includes('DIREIT') ? 'D' : (row.quadrante.includes('ESQUERD') ? 'E' : '');
          const preferredSide = row.lado === 'DIREITO' ? 'D'
            : row.lado === 'ESQUERDO' ? 'E'
              : (['D', 'E'].includes(row.lado) ? row.lado : (sideFromQuadrante || 'D'));
          const key = `${guessScope}_${preferredSide}`;
          autoIndex[key] = (autoIndex[key] || 0) + 1;
          area = `${guessScope}${String(autoIndex[key]).padStart(2, '0')}${preferredSide}`;
        }

        if (!area && ['A', 'B', 'C', 'PRINCIPAL', 'CHAO'].includes(guessScope)) return null;
        if ((guessScope === 'A' || /^A/.test(area)) && /^\d+$/.test(area)) area = `A${String(Number(area)).padStart(2, '0')}`;
        if ((guessScope === 'C' || /^C/.test(area)) && /^\d+$/.test(area)) area = `C${String(Number(area)).padStart(2, '0')}`;
        if ((guessScope === 'B' || guessScope === 'PRINCIPAL') && /^B?\d+$/.test(area)) {
          const num = String(Number(area.replace(/^B/, ''))).padStart(2, '0');
          const bSide = row.quadrante.includes('ESQUERD') || row.lado === 'E' || row.lado === 'ESQUERDO' ? 'E' : 'D';
          area = `B${num}${bSide}`;
        }

        if ((guessScope === 'PRINCIPAL' || guessScope === 'B') && /^B\d+[DE]$/.test(area)) guessScope = 'B';
        if ((guessScope === 'PRINCIPAL' || !guessScope) && /^A\d+$/.test(area)) guessScope = 'A';
        if ((guessScope === 'PRINCIPAL' || !guessScope) && /^C\d+$/.test(area)) guessScope = 'C';

        return { ...row, area, tipoPlt: ['PL2', 'PBR'].includes(row.tipoPlt) ? row.tipoPlt : '' };
      })
      .filter((row) => row && (
        positionsAll.has(normalizeAreaCode(row.area))
        || /^(?:TISSUE|TTD|LONIL)\d+[DE]$/.test(normalizeAreaCode(row.area))
        || /^(?:R\d+\.\d+|CHAOESTRUTURA|TUNEL|CHAO_[A-Z]+_[DE]|CHAO_PRINCIPAL)$/.test(normalizeAreaCode(row.area))
      ))
      .sort((a, b) => normalizeAreaCode(a.area).localeCompare(normalizeAreaCode(b.area), 'pt-BR', { numeric: true }));

    if (!validRows.length) {
      setStatus(el.contagemStatus, 'Nenhuma linha válida encontrada na planilha. Verifique colunas sku/deposito/quadrante/qtd plt/tipo plt.', 'error');
      return;
    }

    if (el.contagemImportResetToggle?.checked) {
      contagemMap = {};
    }

    const grouped = validRows.reduce((acc, row) => {
      const area = normalizeAreaCode(row.area);
      if (!acc[area]) acc[area] = [];
      acc[area].push(row);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([area, group]) => {
      const entries = group.map((row) => {
        const total = Number(row.paletes || 0);
        return {
          ...createEmptyContagemEntry(),
          sku: String(row.sku),
          totalManual: total,
          confirmada: false,
          tipoPlt: row.tipoPlt,
          ...(normalizeText(scope) === 'ESTRUTURA' ? {} : estimateLayersFromTotal(total))
        };
      });
      saveContagemEntries(area, entries);
    });

    renderContagemTable();
    setStatus(el.contagemStatus, `Planilha carregada. ${validRows.length} linha(s) aplicadas para conferência manual. Marque "Confirmar" nas linhas corretas e clique em "Atualizar consulta".`, 'success');
  } catch (error) {
    setStatus(el.contagemStatus, `Erro ao ler planilha da contagem: ${error.message}`, 'error');
  }
}

function inferTipoContagem(posicao, sku) {
  const samePos = cache.estoque.find((row) => normalizeAreaCode(row.area) === normalizeAreaCode(posicao) && Number(row.sku) === Number(sku));
  if (samePos?.tipo) return normalizeText(samePos.tipo);
  const sameSku = cache.estoque.find((row) => Number(row.sku) === Number(sku));
  if (sameSku?.tipo) return normalizeText(sameSku.tipo);
  return 'PL2';
}

function getTurnoCarryRows(scopes = []) {
  const selected = new Set((scopes || []).map((v) => normalizeText(v)));
  if (!selected.size) return [];
  const latestTurnoRows = turnoSnapshots[0]?.rows || [];
  return latestTurnoRows
    .filter((row) => selected.has(inferContagemScopeFromPosicao(row.area)))
    .filter((row) => Number(row.paletes) > 0 && Number(row.sku) > 0)
    .map((row) => ({
      area: normalizeAreaCode(row.area),
      sku: Number(row.sku),
      tipo: normalizeText(row.tipo) || inferTipoContagem(row.area, row.sku),
      paletes: Number(row.paletes)
    }));
}

async function applyContagemToConsulta() {
  if (!supabaseClient) return setStatus(el.contagemStatus, 'Banco não conectado para atualizar consulta.', 'error');

  const scope = el.contagemScope?.value || 'A';
  const side = el.contagemSide?.value || 'ALL';
  const positions = getContagemPositions(scope, side);
  const carryScopes = (el.turnoCarryScopes?.() || []).filter((v) => v !== scope);

  const confirmedRows = positions
    .flatMap((posicao) => getContagemEntries(posicao)
      .map((entry) => computeContagem(posicao, entry, scope))
      .filter((row) => row.confirmada && normalizeText(row.sku) && row.paletes > 0)
      .map((row) => ({
        area: normalizeAreaCode(row.posicao),
        sku: Number(row.sku),
        tipo: ['PL2', 'PBR'].includes(normalizeText(row.tipoPlt)) ? normalizeText(row.tipoPlt) : inferTipoContagem(row.posicao, row.sku),
        paletes: Number(row.paletes)
      })));

  const carryRows = getTurnoCarryRows(carryScopes);

  const targetAreas = [...new Set([
    ...positions
      .filter((posicao) => {
        const entries = getContagemEntries(posicao);
        return entries.some((entry) => hasManualContagemData(entry) || Boolean(entry?.confirmada));
      })
      .map((posicao) => normalizeAreaCode(posicao)),
    ...carryRows.map((row) => normalizeAreaCode(row.area))
  ])];

  if (!targetAreas.length) {
    return setStatus(el.contagemStatus, 'Nenhuma posição da área selecionada com dados de contagem para aplicar.', 'error');
  }

  try {
    const { error: deleteError } = await supabaseClient
      .from('estoque_area')
      .delete()
      .in('area', targetAreas);
    if (deleteError) throw deleteError;

    const rowsToUpsert = [...confirmedRows, ...carryRows];
    if (rowsToUpsert.length) {
      const { error: insertError } = await supabaseClient
        .from('estoque_area')
        .upsert(rowsToUpsert);
      if (insertError) throw insertError;
    }
    addContagemUploadLog(rowsToUpsert);

    await loadAll();
    setStatus(el.contagemStatus, `Consulta substituída para ${targetAreas.length} posição(ões) da área ${scope}${side !== 'ALL' ? ` (${side})` : ''}. Confirmadas: ${confirmedRows.length}. Herdadas da conferência: ${carryRows.length}.`, 'success');
    showFeedback('Contagem aplicada na consulta com sucesso.');
  } catch (error) {
    setStatus(el.contagemStatus, `Erro ao atualizar consulta pela contagem: ${error.message}`, 'error');
  }
}

async function clearContagemFromDatabase() {
  if (!supabaseClient) return setStatus(el.contagemStatus, 'Banco não conectado para apagar contagem.', 'error');
  if (!currentUser || !['master', 'analyst'].includes(currentUser.role)) {
    return setStatus(el.contagemStatus, 'Somente mestre/analista pode apagar a contagem.', 'error');
  }
  const confirmed = window.confirm('Deseja realmente apagar toda a contagem salva no banco (estoque_area)?');
  if (!confirmed) return;
  try {
    const { error } = await supabaseClient.from('estoque_area').delete().gt('paletes', -1);
    if (error) throw error;
    addContagemUploadLog([]);
    await loadAll();
    setStatus(el.contagemStatus, 'Contagem apagada do banco com sucesso.', 'success');
    showFeedback('Todas as linhas de contagem foram removidas do banco.');
  } catch (error) {
    setStatus(el.contagemStatus, `Erro ao apagar contagem: ${error.message}`, 'error');
  }
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
    const temDadosDigitados = existentes.some((entry) => normalizeText(entry.sku) || Number(entry.profundidade1) > 0 || Number(entry.largura1) > 0 || Number(entry.paletesTerceira) > 0 || Boolean(entry.usarTotalManual) || Number(entry.fardosFaltando) > 0 || Number(entry.totalManual) > 0);
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
      const sideHint = sideLabel(getSideFromArea(posicao));
      const posLabel = idx === 0 ? `${posicao} <small>${sideHint}</small>` : `<span class="contagem-posicao-sub">↳ ${posicao} <small>${sideHint}</small></span>`;
      const plusOrRemove = idx === 0
        ? `<button type="button" class="secondary contagem-plus-btn" data-action="add-entry" data-posicao="${posicao}">+</button>`
        : `<button type="button" class="contagem-remove-btn" data-action="remove-entry" data-posicao="${posicao}" data-entry-idx="${idx}">−</button>`;

      tr.innerHTML = `
        <td>${plusOrRemove}</td>
        <td>${posLabel}</td>
        <td><input class="contagem-sku-input" data-posicao="${posicao}" data-entry-idx="${idx}" data-field="sku" value="${entry.sku || ''}" /></td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="confirmada" type="checkbox" ${entry.confirmada ? 'checked' : ''} /></td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="blocadoPresente" type="checkbox" ${entry.blocadoPresente ? 'checked' : ''} /></td>
        <td>${isEstrutura || !entry.blocadoPresente ? '<span>-</span>' : `<input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="profundidade1" type="number" min="0" value="${entry.profundidade1 || ''}" />`}</td>
        <td>${isEstrutura || !entry.blocadoPresente ? '<span>-</span>' : `<input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="largura1" type="number" min="0" value="${entry.largura1 || ''}" />`}</td>
        <td>${!entry.blocadoPresente ? '<span>-</span>' : `<input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="terceiraCamada" type="checkbox" ${entry.terceiraCamada ? 'checked' : ''} />`}</td>
        <td>${!entry.blocadoPresente ? '<span>-</span>' : `<input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="paletesTerceira" type="number" min="0" value="${entry.paletesTerceira || ''}" ${entry.terceiraCamada ? '' : 'disabled'} />`}</td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="fardosFaltando" type="number" min="0" value="${entry.fardosFaltando || ''}" /></td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="usarTotalManual" type="checkbox" ${entry.usarTotalManual ? 'checked' : ''} /></td>
        <td><input data-posicao="${posicao}" data-entry-idx="${idx}" data-field="totalManual" type="number" min="0" value="${entry.totalManual || ''}" ${entry.usarTotalManual ? '' : 'disabled'} /></td>
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
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      focusNextContagemInput(event.currentTarget);
    });

    input.addEventListener('change', (event) => {
      const { posicao, entryIdx, field } = event.target.dataset;
      const entries = getContagemEntries(posicao);
      const idx = Number(entryIdx || 0);
      const current = { ...entries[idx] };
      current[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      if (field === 'blocadoPresente' && !event.target.checked) {
        current.profundidade1 = 0;
        current.largura1 = 0;
        current.terceiraCamada = false;
        current.paletesTerceira = 0;
      }
      if (field === 'terceiraCamada' && !event.target.checked) current.paletesTerceira = 0;
      if (field === 'usarTotalManual' && !event.target.checked) current.totalManual = 0;
      entries[idx] = current;
      saveContagemEntries(posicao, entries);
      renderContagemTable();
    });
  });

  renderContagemResumo(computedRows);
}


function focusNextContagemInput(currentInput) {
  if (!el.contagemBody || !currentInput) return;
  const fields = Array.from(el.contagemBody.querySelectorAll('input'))
    .filter((node) => !node.disabled && node.type !== 'hidden');
  const idx = fields.indexOf(currentInput);
  if (idx < 0) return;
  const next = fields[idx + 1];
  if (!next) return;
  next.focus();
  if (next.type !== 'checkbox') next.select?.();
}

function exportContagemExcel() {
  const allScopes = ['A', 'B', 'C', 'ESTRUTURA', 'TISSUE', 'TTD', 'LONIL'];
  const rows = allScopes
    .flatMap((scope) => getContagemPositions(scope, 'ALL')
      .flatMap((p) => getContagemEntries(p).map((entry, idx) => ({ ...computeContagem(p, entry, scope), entry_idx: idx + 1, scope }))))
    .filter((row) => normalizeText(row.sku) && row.paletes > 0)
    .map((row) => ({
      area_contagem: row.scope,
      posicao: row.posicao,
      sku: row.sku,
      confirmada: row.confirmada ? 'SIM' : 'NAO',
      item_posicao: row.entry_idx,
      profundidade_1: row.profundidade1,
      largura_1: row.largura1,
      ultima_camada: row.terceiraCamada ? 'SIM' : 'NAO',
      paletes_ultima: row.terceiraCamada ? row.paletesTerceira : 0,
      fardos_faltando: row.fardosFaltando || 0,
      usar_total_editavel: row.usarTotalManual ? 'SIM' : 'NAO',
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
  showFeedback('Contagem exportada com sucesso (todas as áreas preenchidas).');
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
  el.contagemImportBtn?.addEventListener('click', importContagemFromPlanilha);
  el.contagemClearChecksBtn?.addEventListener('click', () => {
    Object.keys(contagemMap || {}).forEach((posicao) => {
      const entries = getContagemEntries(posicao).map((entry) => ({
        ...entry,
        confirmada: false,
        blocadoPresente: true,
        usarTotalManual: false,
        terceiraCamada: false
      }));
      saveContagemEntries(posicao, entries);
    });
    renderContagemTable();
    setStatus(el.contagemStatus, 'Checkboxes limpos para iniciar novo turno.', 'success');
  });
  el.contagemApplyBtn?.addEventListener('click', applyContagemToConsulta);
  el.contagemDeleteDbBtn?.addEventListener('click', clearContagemFromDatabase);
  el.contagemForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await applyContagemToConsulta();
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
  const normalizeHeader = (key) => String(key || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const row = Object.fromEntries(
    Object.entries(rawRow || {}).map(([k, v]) => [normalizeHeader(k), v])
  );

  const toNum = (v) => {
    if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
    const raw = String(v ?? '').trim().replace(',', '.');
    if (!raw) return NaN;
    const n = Number(raw);
    return Number.isFinite(n) ? n : NaN;
  };

  const depositoRaw = normalizeText(row.deposito ?? row.deposito ?? row.setor ?? row.rua ?? row.local);
  const quadranteRaw = String(row.quadrante ?? row.endereco ?? row.endereço ?? row.area ?? row.posicao ?? '').trim();
  const quadrante = normalizeAreaCode(quadranteRaw);
  const ladoRaw = normalizeText(row.lado ?? row.side ?? '');

  const inferArea = () => {
    const explicitArea = normalizeAreaCode(row.area ?? row['área'] ?? row.endereco ?? row.endereço ?? row.posicao);
    if (explicitArea) return explicitArea;

    const dep = depositoRaw;
    const q = quadrante;
    if (!q && !dep) return '';

    if (dep.includes('ESTRUT')) {
      if (q.includes('TUNEL')) return 'TUNEL';
      if (q.includes('CHAO')) return 'CHAOESTRUTURA';
      if (/^R\d+\.\d+(?:-\d+)?$/.test(q)) return normalizeAreaCode(q.replace(/-(\d+)$/, ''));
      return normalizeAreaCode(q);
    }

    if (dep.includes('TISSUE') || dep.includes('TSUI')) {
      const side = ladoRaw.startsWith('E') || q.includes('ESQUER') ? 'E' : 'D';
      if (q.includes('CHAO')) return `CHAO_TISSUE_${side}`;
      if (/^\d+$/.test(q)) return `TISSUE${String(Number(q)).padStart(2, '0')}${side}`;
      if (/^TISSUE\d+[DE]$/.test(normalizeAreaCode(q))) return normalizeAreaCode(q);
      if (q === 'D' || q === 'E') return `TISSUE01${q}`;
      return `TISSUE01${side}`;
    }

    if (dep.includes('LONIL')) {
      const side = ladoRaw.startsWith('E') || q.includes('ESQUER') ? 'E' : 'D';
      if (q.includes('CHAO')) return `CHAO_LONIL_${side}`;
      if (/^\d+$/.test(q)) return `LONIL${String(Number(q)).padStart(2, '0')}${side}`;
      if (/^LONIL\d+[DE]$/.test(normalizeAreaCode(q))) return normalizeAreaCode(q);
      if (q === 'D' || q === 'E') return `LONIL01${q}`;
      return `LONIL01${side}`;
    }

    if (dep.includes('TTD') || dep.includes('TTT')) {
      const side = ladoRaw.startsWith('E') || q.includes('ESQUER') ? 'E' : 'D';
      if (q.includes('CHAO')) return `CHAO_TTD_${side}`;
      if (/^\d+$/.test(q)) return `TTD${String(Number(q)).padStart(2, '0')}${side}`;
      if (/^TTD\d+[DE]$/.test(normalizeAreaCode(q))) return normalizeAreaCode(q);
      if (q === 'D' || q === 'E') return `TTD01${q}`;
      return `TTD01${side}`;
    }

    if (dep.includes('PRINCIPAL') || !dep) {
      if (q.includes('PICKING')) return 'PICKING';
      if (q.includes('CHAO')) return 'CHAO_PRINCIPAL';
      if (/^A\d+$/.test(normalizeAreaCode(q))) return normalizeAreaCode(q);
      if (/^C\d+$/.test(normalizeAreaCode(q))) return normalizeAreaCode(q);
      if (/^B\d+[DE]$/.test(normalizeAreaCode(q))) return normalizeAreaCode(q);
      if (/^B\d+$/.test(normalizeAreaCode(q))) return `${normalizeAreaCode(q)}D`;
      return normalizeAreaCode(q);
    }

    return normalizeAreaCode(q);
  };

  const paletesRaw = row.paletes ?? row.pallets ?? row.quantidade ?? row.qtd_plt ?? row['qtd plt'] ?? row.qtdplt;
  const tipoRaw = row.tipo ?? row.produto_tipo ?? row.tipo_plt ?? row['tipo plt'];
  const skuRaw = row.sku ?? row.codsku ?? row['cod_sku'] ?? row['cód_sku'];

  return {
    area: inferArea(),
    sku: toNum(skuRaw),
    tipo: normalizeText(tipoRaw) || 'PL2',
    paletes: toNum(paletesRaw),
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
  el.exportCadastroBtn?.addEventListener('click', () => {
    const { rows: estoqueExportRows, missingSkus } = buildEstoqueExportRows();
    const totais = groupTotalBySku(cache.estoque, { excludeRetrabalho: true });
    exportWorkbook('cadastro_estoque.xlsx', [
      { name: 'Estoque', data: estoqueExportRows },
      { name: 'Totais_SKU', data: totais }
    ]);
    if (missingSkus.length) showFeedback(`Aviso: SKU(s) sem fardos por palete: ${missingSkus.join(', ')}.`, 'error');
  });

  el.exportConsultaBtn?.addEventListener('click', () => {
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
  el.aiAssistBtn?.addEventListener('click', runAiAssist);

  el.planejamentoEstimateTurnoBtn?.addEventListener('click', () => {
    const estimadas = estimateContagemFromTurno(el.contagemScope?.value || 'A', el.contagemSide?.value || 'ALL');
    renderContagemTable();
    setStatus(el.planejamentoResultado, estimadas
      ? `Estimativa da última conferência aplicada em ${estimadas} linha(s) na Contagem.`
      : 'Sem dados da última conferência para estimar.', estimadas ? 'success' : 'error');
  });

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

function exportConsultaResumoPDF() {
  if (!window.jspdf) return showFeedback('Biblioteca de PDF não carregada.', 'error');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('portrait');
  let y = 12;
  pdf.setFontSize(13);
  pdf.text('Resumo Consulta / Ocupação', 10, y);
  y += 8;
  pdf.setFontSize(10);
  const resumo = getPaletesResumoPorSetor();
  pdf.text(`Principal: ${resumo.principal} paletes`, 10, y); y += 6;
  pdf.text(`Tissue: ${resumo.tissue} paletes`, 10, y); y += 6;
  pdf.text(`TDD: ${resumo.ttd} paletes`, 10, y); y += 6;
  pdf.text(`Lonil: ${resumo.lonil} paletes`, 10, y); y += 8;
  const totals = groupTotalBySku(filterConsultaRows(cache.estoque), { excludeRetrabalho: true }).slice(0, 20);
  pdf.text('SKUs (top 20 no filtro):', 10, y); y += 6;
  totals.forEach((item) => {
    pdf.text(`SKU ${item.sku}: ${item.total_paletes} paletes`, 10, y);
    y += 5;
    if (y > 280) { pdf.addPage(); y = 12; }
  });
  pdf.save('resumo_consulta_ocupacao.pdf');
}

function setupConsulta() {
  el.consultaFilterForm?.addEventListener('change', renderConsulta);
  el.consultaSkuSearch?.addEventListener('input', renderConsulta);
  el.mapaAreaSelect?.addEventListener('change', renderConsultaMapaHint);
  el.mapaPosicaoInput?.addEventListener('input', renderConsultaMapaHint);
  el.exportConsultaResumoPdfBtn?.addEventListener('click', exportConsultaResumoPDF);
  document.querySelectorAll('.consulta-subnav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.consulta-subnav-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.consulta-view').forEach((v) => v.classList.remove('active'));
      btn.classList.add('active');
      const viewMap = {
        geral: 'consultaViewGeral',
        chao: 'consultaViewChao',
        'sku-area': 'consultaViewSkuArea',
        mapa: 'consultaViewMapa'
      };
      document.getElementById(viewMap[btn.dataset.consultaView])?.classList.add('active');
    });
  });
}

function setupOcupacao() {
  el.ocupacaoForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    renderOcupacao();
  });
}

function parseMb52SkuRows(rows) {
  return rows
    .map((rawRow) => {
      const row = Object.fromEntries(Object.entries(rawRow || {}).map(([k, v]) => [normalizeHeaderKey(k), v]));
      const material = normalizeMaterialCode(row.sku ?? row.material ?? row['codigo material'] ?? row['código material']);
      return material;
    })
    .filter(Boolean);
}

function extractMb51RowsFromMb52(rows) {
  return (rows || [])
    .map(mapMb51Row)
    .filter((row) => row.centro && row.material && Number.isFinite(row.utilizacaoLivre));
}

function renderMb52Comparison(skuList, sourceLabel = 'planilha') {
  if (!el.mb52TableBody) return;
  const uniqueSkus = [...new Set((skuList || []).map((sku) => normalizeMaterialCode(sku)).filter(Boolean))];
  if (!uniqueSkus.length) {
    setStatus(el.mb52Status, 'Nenhum SKU/Material válido encontrado para comparação.', 'error');
    return;
  }

  const contagemTotals = getSistemaTotalsBySku();
  const mb51BySku = mb51Snapshot.reduce((acc, row) => {
    const key = normalizeMaterialCode(row.material);
    if (!key) return acc;
    const current = acc[key] || { utilizacaoLivre: 0, descricao: row.descricao || '' };
    current.utilizacaoLivre += Number(row.utilizacaoLivre || 0);
    if (!current.descricao && row.descricao) current.descricao = row.descricao;
    acc[key] = current;
    return acc;
  }, {});

  el.mb52TableBody.innerHTML = '';
  uniqueSkus.forEach((sku) => {
    const mb51 = Number(mb51BySku[sku]?.utilizacaoLivre || 0);
    const contagem = Number(contagemTotals[sku] || 0);
    const diff = contagem - mb51;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${sku}</td>
      <td>${mb51BySku[sku]?.descricao || '-'}</td>
      <td>${formatFardos(mb51)}</td>
      <td>${formatFardos(contagem)}</td>
      <td>${formatFardos(diff)}</td>
    `;
    el.mb52TableBody.appendChild(tr);
  });

  setStatus(el.mb52Status, `Comparação concluída para ${uniqueSkus.length} SKU(s) (${sourceLabel}).`, 'success');
}

async function handleMb52Submit(event) {
  event.preventDefault();
  const file = el.mb52File?.files?.[0];
  if (!file) return setStatus(el.mb52Status, 'Selecione a planilha de SKUs.', 'error');

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const parsedRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    mb52LastSkuList = parseMb52SkuRows(parsedRows);
    const mb51Rows = extractMb51RowsFromMb52(parsedRows);
    if (mb51Rows.length) {
      saveMb51Snapshot(mb51Rows);
      renderMb51Table(selectedMb51Centro || getMb51Centros()[0] || '');
      setStatus(el.mb51Status, `Base por centro atualizada automaticamente com ${mb51Rows.length} linha(s) da planilha MB52.`, 'success');
    } else {
      setStatus(el.mb51Status, 'Planilha MB52 enviada sem colunas de centro/utilização livre. Mantendo base anterior por centro.', '');
    }
    renderMb52Comparison(mb52LastSkuList, 'planilha enviada');
  } catch (error) {
    setStatus(el.mb52Status, `Erro ao processar MB52: ${error.message}`, 'error');
  }
}

function refreshMb52Comparison() {
  if (!mb52LastSkuList.length) {
    setStatus(el.mb52Status, 'Faça uma comparação de MB52 primeiro para habilitar o refresh.', 'error');
    return;
  }
  renderMb52Comparison(mb52LastSkuList, 'refresh sem recarregar página');
}

function setupMb51Mb52() {
  loadMb51Snapshot();
  renderMb51CenterButtons();
  if (mb51Snapshot.length) renderMb51Table(getMb51Centros()[0] || '');
  el.mb52Form?.addEventListener('submit', handleMb52Submit);
  el.mb52RefreshBtn?.addEventListener('click', refreshMb52Comparison);
}

function setupLogs() {
  renderLogsTable();
  el.openLogsBtn?.addEventListener('click', () => {
    document.querySelector('.tab-btn[data-tab="logs"]')?.click();
  });
  el.logsBackBtn?.addEventListener('click', () => {
    document.querySelector('.tab-btn[data-tab="cadastro"]')?.click();
  });
}

function init() {
  setupTabs();
  setupLogin();
  setupExports();
  setupConsulta();
  setupPlanejamento();
  setupOcupacao();
  setupMb51Mb52();
  setupLogs();
  setupContagem();
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
  el.userForm?.addEventListener('submit', handleUserSubmit);
  el.expedicaoForm?.addEventListener('submit', handleExpedicaoSubmit);
  el.importForm?.addEventListener('submit', handleImportSubmit);
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
    el.themeToggleBtn.textContent = isDark ? '☀️ Modo claro' : '🌙 Modo escuro';
  });
  el.autoExportToggle?.addEventListener('change', (event) => {
    const enabled = event.target.checked;
    showFeedback(enabled ? 'Auto planilha ativado.' : 'Auto planilha desativado.');
  });
  createClient();
}

init();
