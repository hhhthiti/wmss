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
    exportExpedicaoBtn: document.getElementById('exportExpedicaoBtn'),
    // Elementos do Mapa
    mapSku: document.getElementById('mapSku'),
    mapQtd: document.getElementById('mapQtd'),
    mapaTableBody: document.querySelector('#mapaTable tbody'),
    addMapaBtn: document.getElementById('addMapaBtn'),
    gerarMapaBtn: document.getElementById('gerarMapaBtn')
};

let supabaseClient;
let cache = { estoque: [], movimentacoes: [] };
let mapaItens = []; // Itens temporários para o PDF

el.supabaseUrl.value = defaultConfig.url;
el.supabaseKey.value = defaultConfig.key;

// --- UTILITÁRIOS ---
function setStatus(target, message, type = '') {
    if (!target) return;
    target.textContent = message;
    target.className = `status ${type}`.trim();
}

function showFeedback(message, type = 'success') {
    setStatus(el.feedback, message, type);
}

// --- CONEXÃO ---
function createClient() {
    const url = el.supabaseUrl.value.trim();
    const key = el.supabaseKey.value.trim();
    if (!url || !key) {
        setStatus(el.connectionStatus, 'Informe URL e chave.', 'error');
        return;
    }
    supabaseClient = window.supabase.createClient(url, key);
    setStatus(el.connectionStatus, 'Conectado ao Supabase.', 'success');
    loadAll();
}

// --- CARREGAMENTO DE DADOS ---
async function loadEstoque() {
    const { data, error } = await supabaseClient
        .from('estoque_area')
        .select('area, sku, tipo, paletes')
        .order('area', { ascending: true });

    if (error) throw error;
    cache.estoque = data ?? [];
    renderEstoque();
    renderConsulta();
}

async function loadMovimentacoes() {
    const { data, error } = await supabaseClient
        .from('movimentacoes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) throw error;
    cache.movimentacoes = data ?? [];
    renderMovimentacoes();
}

async function loadAll() {
    if (!supabaseClient) return;
    try {
        await Promise.all([loadEstoque(), loadMovimentacoes()]);
        showFeedback('Dados sincronizados.');
    } catch (error) {
        showFeedback(`Erro ao carregar: ${error.message}`, 'error');
    }
}

// --- RENDERIZAÇÃO ---
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
                <button class="edit-btn">Editar</button>
                <button class="delete-btn danger">Excluir</button>
            </td>
        `;

        tr.querySelector('.edit-btn').addEventListener('click', () => {
            el.estoqueForm.area.value = row.area;
            el.estoqueForm.sku.value = row.sku;
            el.estoqueForm.tipo.value = row.tipo;
            el.estoqueForm.paletes.value = row.paletes;
            window.scrollTo(0,0);
        });

        tr.querySelector('.delete-btn').addEventListener('click', async () => {
            if (!confirm(`Excluir SKU ${row.sku} da área ${row.area}?`)) return;
            const { error } = await supabaseClient.from('estoque_area').delete().match({ area: row.area, sku: row.sku, tipo: row.tipo });
            if (!error) loadEstoque();
        });

        el.estoqueTableBody.appendChild(tr);
    });
}

function renderConsulta() {
    el.consultaAreaBody.innerHTML = '';
    cache.estoque.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.area}</td><td>${row.sku}</td><td>${row.tipo}</td><td>${row.paletes}</td>`;
        el.consultaAreaBody.appendChild(tr);
    });

    // Renderiza Totais
    const totals = cache.estoque.reduce((acc, row) => {
        acc[row.sku] = (acc[row.sku] || 0) + Number(row.paletes);
        return acc;
    }, {});
    
    el.totaisSkuBody.innerHTML = '';
    Object.entries(totals).forEach(([sku, total]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${sku}</td><td>${total}</td>`;
        el.totaisSkuBody.appendChild(tr);
    });
}

function renderMovimentacoes() {
    el.movimentacoesBody.innerHTML = '';
    cache.movimentacoes.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${new Date(row.created_at).toLocaleString()}</td><td>${row.sku}</td><td>${row.tipo}</td><td>${row.paletes}</td>`;
        el.movimentacoesBody.appendChild(tr);
    });
}

// --- MAPA DE SEPARAÇÃO (PDF) ---
function adicionarItemMapa() {
    const sku = Number(el.mapSku.value);
    const qtd = Number(el.mapQtd.value);
    if (!sku || !qtd) return alert("Preencha SKU e Qtd");
    
    mapaItens.push({ sku, qtd });
    renderMapaTabela();
    el.mapSku.value = ''; el.mapQtd.value = '';
}

function renderMapaTabela() {
    el.mapaTableBody.innerHTML = '';
    mapaItens.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.sku}</td><td>${item.qtd}</td><td><button onclick="removerItemMapa(${index})">Remover</button></td>`;
        el.mapaTableBody.appendChild(tr);
    });
}

window.removerItemMapa = (index) => {
    mapaItens.splice(index, 1);
    renderMapaTabela();
};

function gerarMapaPDF() {
    if (mapaItens.length === 0) return alert("Mapa vazio!");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16).text("MAPA DE SEPARAÇÃO", 10, y);
    y += 10;

    mapaItens.forEach(item => {
        doc.setFontSize(12).setFont(undefined, 'bold').text(`SKU: ${item.sku} | Fardos: ${item.qtd}`, 10, y);
        y += 7;
        doc.setFont(undefined, 'normal');

        const locais = cache.estoque.filter(e => e.sku == item.sku);
        if (locais.length === 0) {
            doc.text("   (Sem estoque registrado)", 15, y);
            y += 6;
        } else {
            locais.forEach(l => {
                doc.text(`   Área: ${l.area} -> ${l.paletes} paletes (${l.tipo})`, 15, y);
                y += 6;
            });
        }
        y += 4;
        if (y > 280) { doc.addPage(); y = 20; }
    });
    doc.save("mapa_separacao.pdf");
}

// --- FORMULÁRIOS ---
async function handleEstoqueSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
        area: fd.get('area').toUpperCase(),
        sku: Number(fd.get('sku')),
        tipo: fd.get('tipo').toUpperCase(),
        paletes: Number(fd.get('paletes'))
    };
    const { error } = await supabaseClient.from('estoque_area').upsert(payload);
    if (!error) { showFeedback("Salvo!"); e.target.reset(); loadEstoque(); }
}

async function handleExpedicaoSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const area = fd.get('area').toUpperCase();
    const sku = Number(fd.get('sku'));
    const paletes = Number(fd.get('paletes'));
    const tipo = fd.get('tipo').toUpperCase();

    // Lógica de baixa... (simplificada para o exemplo)
    const item = cache.estoque.find(i => i.area === area && i.sku === sku && i.tipo === tipo);
    if (!item || item.paletes < paletes) return showFeedback("Estoque insuficiente", "error");

    const novoSaldo = item.paletes - paletes;
    let res;
    if (novoSaldo === 0) {
        res = await supabaseClient.from('estoque_area').delete().match({ area, sku, tipo });
    } else {
        res = await supabaseClient.from('estoque_area').update({ paletes: novoSaldo }).match({ area, sku, tipo });
    }

    if (!res.error) {
        await supabaseClient.from('movimentacoes').insert({ sku, tipo, paletes });
        showFeedback("Expedição concluída");
        e.target.reset();
        loadAll();
    }
}

// --- FILTROS ---
function setupSearch() {
    const filterFn = (inputId, tableId) => {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener('keyup', () => {
            const val = input.value.toLowerCase();
            document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
                tr.style.display = tr.innerText.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    };
    filterFn('searchCadastroInput', 'estoqueTable');
    filterFn('searchInput', 'consultaAreaTable');
}

// --- INICIALIZAÇÃO ---
function init() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    el.connectBtn.addEventListener('click', createClient);
    el.estoqueForm.addEventListener('submit', handleEstoqueSubmit);
    el.expedicaoForm.addEventListener('submit', handleExpedicaoSubmit);
    el.addMapaBtn.addEventListener('click', adicionarItemMapa);
    el.gerarMapaBtn.addEventListener('click', gerarMapaPDF);
    
    setupSearch();
    createClient(); // Auto-conecta no início
}

init();
