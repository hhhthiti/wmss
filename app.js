/**
 * WMSS - Controle de Estoque JSL
 * Desenvolvido por Thiago
 */

// 1. CONFIGURAÇÕES INICIAIS E CREDENCIAIS
const defaultConfig = {
    url: 'https://qfjghplxbtogshfjkawx.supabase.co',
    key: 'sb_publishable_rIcKdaflOvJ0DLTJDcOrxA_bpTGG2hA'
};

// 2. MAPEAMENTO DE ELEMENTOS DA INTERFACE (DOM)
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
    // Elementos da funcionalidade de Mapa de Separação
    mapSku: document.getElementById('mapSku'),
    mapQtd: document.getElementById('mapQtd'),
    mapaTableBody: document.querySelector('#mapaTable tbody'),
    addMapaBtn: document.getElementById('addMapaBtn'),
    gerarMapaBtn: document.getElementById('gerarMapaBtn')
};

// 3. VARIÁVEIS DE ESTADO (CACHE)
let supabaseClient;
let cache = { estoque: [], movimentacoes: [] };
let mapaItens = []; // Lista temporária de SKUs para o PDF

// Define valores padrão nos campos de configuração
el.supabaseUrl.value = defaultConfig.url;
el.supabaseKey.value = defaultConfig.key;

// --- FUNÇÕES UTILITÁRIAS ---

// Exibe status de conexão ou erros
function setStatus(target, message, type = '') {
    if (!target) return;
    target.textContent = message;
    target.className = `status ${type}`.trim();
}

// Exibe mensagens de feedback temporárias no rodapé
function showFeedback(message, type = 'success') {
    setStatus(el.feedback, message, type);
}

// --- LOGICA DE CONEXÃO COM O BANCO ---

function createClient() {
    const url = el.supabaseUrl.value.trim();
    const key = el.supabaseKey.value.trim();
    if (!url || !key) {
        setStatus(el.connectionStatus, 'Informe URL e chave.', 'error');
        return;
    }
    // Inicializa o cliente Supabase
    supabaseClient = window.supabase.createClient(url, key);
    setStatus(el.connectionStatus, 'Conectado ao Supabase.', 'success');
    loadAll(); // Carrega os dados após conectar
}

// --- CARREGAMENTO E SINCRONIZAÇÃO ---

async function loadEstoque() {
    const { data, error } = await supabaseClient
        .from('estoque_area')
        .select('area, sku, tipo, paletes')
        .order('area', { ascending: true });

    if (error) throw error;
    cache.estoque = data ?? [];
    renderEstoque(); // Atualiza tabela de cadastro
    renderConsulta(); // Atualiza tabela de consulta e totais
}

async function loadMovimentacoes() {
    const { data, error } = await supabaseClient
        .from('movimentacoes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) throw error;
    cache.movimentacoes = data ?? [];
    renderMovimentacoes(); // Atualiza histórico de expedição
}

async function loadAll() {
    if (!supabaseClient) return;
    try {
        await Promise.all([loadEstoque(), loadMovimentacoes()]);
        showFeedback('Dados sincronizados com sucesso.');
    } catch (error) {
        showFeedback(`Erro ao carregar: ${error.message}`, 'error');
    }
}

// --- RENDERIZAÇÃO DE TABELAS ---

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

        // Evento de Editar: Preenche o formulário lá no topo
        tr.querySelector('.edit-btn').addEventListener('click', () => {
            el.estoqueForm.area.value = row.area;
            el.estoqueForm.sku.value = row.sku;
            el.estoqueForm.tipo.value = row.tipo;
            el.estoqueForm.paletes.value = row.paletes;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Evento de Excluir posição
        tr.querySelector('.delete-btn').addEventListener('click', async () => {
            if (!confirm(`Excluir SKU ${row.sku} da área ${row.area}?`)) return;
            const { error } = await supabaseClient.from('estoque_area')
                .delete()
                .match({ area: row.area, sku: row.sku, tipo: row.tipo });
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

    // Calcula e renderiza os totais agrupados por SKU
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

// --- SISTEMA DO MAPA DE SEPARAÇÃO (PDF) ---

function adicionarItemMapa() {
    const sku = el.mapSku.value.trim();
    const qtd = Number(el.mapQtd.value);
    if (!sku || !qtd) return alert("Preencha o SKU e a Quantidade!");
    
    mapaItens.push({ sku, qtd });
    renderMapaTabela();
    el.mapSku.value = ''; el.mapQtd.value = '';
}

function renderMapaTabela() {
    el.mapaTableBody.innerHTML = '';
    mapaItens.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.sku}</td><td>${item.qtd}</td><td><button class="danger" onclick="removerItemMapa(${index})">Remover</button></td>`;
        el.mapaTableBody.appendChild(tr);
    });
}

// Tornar global para o botão 'remover' funcionar no HTML gerado
window.removerItemMapa = (index) => {
    mapaItens.splice(index, 1);
    renderMapaTabela();
};

/**
 * GERAÇÃO DO PDF ESTILIZADO JSL
 * Regras: Somente 2 posições por SKU, Logo JSL, Assinatura Thiago
 */
function gerarMapaPDF() {
    if (mapaItens.length === 0) return alert("O mapa está vazio!");
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    // --- Cabeçalho Estilizado ---
    doc.setFillColor(230, 0, 0); // Vermelho JSL
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("JSL", 10, 17);
    doc.setFontSize(12);
    doc.text("LOGÍSTICA - MAPA DE SEPARAÇÃO", 40, 17);

    y = 40;

    // --- Lista de Itens ---
    mapaItens.forEach((item, index) => {
        // Título do SKU
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. SKU: ${item.sku} | NECESSÁRIO: ${item.qtd} fardos`, 10, y);
        y += 8;

        // Filtragem: Pega apenas as 2 primeiras áreas onde tem esse SKU
        const locais = cache.estoque
            .filter(e => String(e.sku) === String(item.sku))
            .sort((a, b) => a.area.localeCompare(b.area))
            .slice(0, 2); // LIMITE DE 2 POSIÇÕES

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        
        if (locais.length === 0) {
            doc.setTextColor(150, 150, 150);
            doc.text("   (Produto não encontrado no estoque atual)", 15, y);
            y += 8;
        } else {
            locais.forEach(l => {
                doc.setTextColor(0, 0, 0);
                doc.text(`   ÁREA: ${l.area}  |  QUANTIDADE: ${l.paletes} paletes (${l.tipo})`, 15, y);
                y += 6;
            });
            y += 4;
        }

        // Linha divisória fina
        doc.setDrawColor(200, 200, 200);
        doc.line(10, y, pageWidth - 10, y);
        y += 10;

        // Controle de quebra de página
        if (y > 270) { doc.addPage(); y = 20; }
    });

    // --- Rodapé JSL + Assinatura ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const dataHora = new Date().toLocaleString();
    doc.text(`Gerado em: ${dataHora}`, 10, pageHeight - 10);
    
    doc.setFont("helvetica", "italic");
    doc.text("by thiago", pageWidth - 25, pageHeight - 10);

    doc.save(`Mapa_Separacao_JSL.pdf`);
}

// --- PROCESSAMENTO DE FORMULÁRIOS ---

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
    if (!error) { 
        showFeedback("Posição salva com sucesso!"); 
        e.target.reset(); 
        loadEstoque(); 
    }
}

async function handleExpedicaoSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const area = fd.get('area').toUpperCase();
    const sku = Number(fd.get('sku'));
    const paletes = Number(fd.get('paletes'));
    const tipo = fd.get('tipo').toUpperCase();

    // Validação de saldo no cache antes de enviar ao banco
    const item = cache.estoque.find(i => i.area === area && i.sku === sku && i.tipo === tipo);
    if (!item || item.paletes < paletes) return showFeedback("Estoque insuficiente nesta área!", "error");

    const novoSaldo = item.paletes - paletes;
    let res;

    // Se o saldo zerar, deleta a linha. Se sobrar, atualiza.
    if (novoSaldo === 0) {
        res = await supabaseClient.from('estoque_area').delete().match({ area, sku, tipo });
    } else {
        res = await supabaseClient.from('estoque_area').update({ paletes: novoSaldo }).match({ area, sku, tipo });
    }

    if (!res.error) {
        // Registra a saída no histórico de movimentações
        await supabaseClient.from('movimentacoes').insert({ sku, tipo, paletes });
        showFeedback("Expedição realizada com sucesso!");
        e.target.reset();
        loadAll();
    }
}

// --- SISTEMA DE BUSCA (FILTROS) ---

function setupSearch() {
    const filterFn = (inputId, tableId) => {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener('keyup', () => {
            const val = input.value.toLowerCase();
            document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
                // Filtra verificando se o texto da linha contém o termo buscado
                tr.style.display = tr.innerText.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    };
    filterFn('searchCadastroInput', 'estoqueTable');
    filterFn('searchInput', 'consultaAreaTable');
}

// --- INICIALIZAÇÃO DA APLICAÇÃO ---

function init() {
    // Lógica das Abas (Navegação)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Registro de Eventos dos Botões e Formulários
    el.connectBtn.addEventListener('click', createClient);
    el.estoqueForm.addEventListener('submit', handleEstoqueSubmit);
    el.expedicaoForm.addEventListener('submit', handleExpedicaoSubmit);
    el.addMapaBtn.addEventListener('click', adicionarItemMapa);
    el.gerarMapaBtn.addEventListener('click', gerarMapaPDF);
    
    setupSearch(); // Ativa as barras de busca
    createClient(); // Tentativa de auto-conexão ao abrir a página
}

// Lança a aplicação
init();
