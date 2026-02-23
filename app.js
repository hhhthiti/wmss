/**
 * WMSS - Controle de Estoque JSL
 * Desenvolvido por Thiago
 */

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
    expedicaoForm: document.getElementById('expedicaoForm'),
    estoqueTableBody: document.querySelector('#estoqueTable tbody'),
    consultaAreaBody: document.querySelector('#consultaAreaTable tbody'),
    mapSku: document.getElementById('mapSku'),
    mapQtd: document.getElementById('mapQtd'),
    mapaTableBody: document.querySelector('#mapaTable tbody'),
    addMapaBtn: document.getElementById('addMapaBtn'),
    gerarMapaBtn: document.getElementById('gerarMapaBtn'),
    importForm: document.getElementById('importForm'),
    importFile: document.getElementById('importFile'),
    exportCadastroBtn: document.getElementById('exportCadastroBtn'),
    // Layout visual
    visualizarLayoutBtn: document.getElementById('visualizarLayoutBtn'),
    layoutContainer: document.getElementById('layoutContainer'),
    layoutGrid: document.getElementById('layoutGrid'),
    exportLayoutPdfBtn: document.getElementById('exportLayoutPdfBtn'),
    fecharLayoutBtn: document.getElementById('fecharLayoutBtn')
};

let supabaseClient;
let cache = { estoque: [] };

el.supabaseUrl.value = defaultConfig.url;
el.supabaseKey.value = defaultConfig.key;

// --- Função de feedback visual ---
function showFeedback(message, type = 'success') {
    el.feedback.textContent = message;
    el.feedback.className = `status ${type}`;
    setTimeout(() => { el.feedback.textContent = ''; }, 4000);
}

// --- Criar cliente Supabase ---
async function createClient() {
    const url = el.supabaseUrl.value.trim();
    const key = el.supabaseKey.value.trim();
    if (!url || !key) return;
    supabaseClient = window.supabase.createClient(url, key);
    loadAll();
}

// --- Carregar dados do Supabase ---
async function loadAll() {
    try {
        const { data, error } = await supabaseClient.from('estoque_area').select('*').order('area');
        if (error) throw error;
        cache.estoque = data || [];
        renderTables();
    } catch (e) { showFeedback(e.message, 'error'); }
}

// --- Renderizar tabelas ---
function renderTables() {
    el.estoqueTableBody.innerHTML = '';
    cache.estoque.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.area}</td><td>${row.sku}</td><td>${row.tipo}</td><td>${row.paletes}</td>
            <td><button class="danger btn-sm" onclick="deletarItem('${row.area}', ${row.sku}, '${row.tipo}')">Excluir</button></td>`;
        el.estoqueTableBody.appendChild(tr);
    });

    el.consultaAreaBody.innerHTML = '';
    cache.estoque.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.area}</td><td>${row.sku}</td><td>${row.tipo}</td><td>${row.paletes}</td>`;
        el.consultaAreaBody.appendChild(tr);
    });
}

window.deletarItem = async (area, sku, tipo) => {
    if (!confirm('Excluir este registro?')) return;
    const { error } = await supabaseClient.from('estoque_area').delete().match({ area, sku, tipo });
    if (!error) loadAll();
};

// --- Layout visual ---
function gerarLayoutVisual() {

    el.layoutGrid.innerHTML = '';

    const colunas = ['TISSUE', 'C', 'B', 'A', 'LONIL'];
    const linhas = 12; // quantidade de posições no comprimento

    const grid = document.createElement('div');
    grid.className = 'planta-grid';

    for (let i = 0; i < linhas; i++) {
        colunas.forEach(col => {

            const cell = document.createElement('div');
            cell.className = 'celula';

            const areaNome = `${col}${i + 1}`;

            const itens = cache.estoque.filter(x =>
                x.area.toUpperCase() === areaNome
            );

            let conteudo = `<strong>${areaNome}</strong>`;

            if (itens.length > 0) {
                itens.forEach(item => {
                    conteudo += `<div class="sku">
                        SKU: ${item.sku}<br>
                        ${item.paletes} pal
                    </div>`;
                });
                cell.classList.add('ocupado');
            } else {
                cell.classList.add('vazio');
            }

            cell.innerHTML = conteudo;
            grid.appendChild(cell);
        });
    }

    el.layoutGrid.appendChild(grid);
    el.layoutContainer.classList.remove('hidden');
}
// --- Exportar layout PDF ---
function exportarLayoutPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;
    doc.text("Layout Visual de Estoque - JSL", 10, y);
    y += 10;

    const areas = {};
    cache.estoque.forEach(item => {
        if (!areas[item.area]) areas[item.area] = [];
        areas[item.area].push(item);
    });

    Object.keys(areas).sort().forEach(area => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(12);
        doc.text(`Área: ${area}`, 10, y);
        y += 6;
        doc.setFontSize(10);
        areas[area].forEach(item => {
            doc.text(` - SKU ${item.sku}: ${item.paletes} (${item.tipo})`, 15, y);
            y += 5;
        });
        y += 5;
    });
    doc.save("Layout_Estoque.pdf");
}

// --- Formulário de cadastro ---
el.estoqueForm.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
        area: fd.get('area').toUpperCase(),
        sku: Number(fd.get('sku')),
        tipo: fd.get('tipo'),
        paletes: Number(fd.get('paletes'))
    };
    const { error } = await supabaseClient.from('estoque_area').upsert(payload);
    if (!error) { showFeedback("Salvo!"); loadAll(); e.target.reset(); }
};

// --- Importar planilha ---
el.importForm.onsubmit = async (e) => {
    e.preventDefault();
    const file = el.importFile.files[0];
    if (!file) return showFeedback('Selecione um arquivo primeiro!', 'error');

    try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        for (const r of rows) {
            const payload = {
                area: String(r.area || r.Area || '').toUpperCase(),
                sku: Number(r.sku || r.SKU),
                tipo: String(r.tipo || r.Tipo || '').toUpperCase(),
                paletes: Number(r.paletes || r.Paletes || 0)
            };
            if (payload.area && payload.sku && payload.tipo) {
                await supabaseClient.from('estoque_area').upsert(payload);
            }
        }

        showFeedback('Planilha importada com sucesso!');
        loadAll();
        e.target.reset();
    } catch (err) {
        console.error(err);
        showFeedback('Erro ao importar: ' + err.message, 'error');
    }
};

// --- Exportar planilha ---
el.exportCadastroBtn.onclick = async () => {
    try {
        if (!cache.estoque.length) {
            showFeedback('Nenhum dado para exportar!', 'error');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(cache.estoque);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Estoque');
        XLSX.writeFile(wb, 'Estoque_JSL.xlsx');
        showFeedback('Planilha exportada com sucesso!');
    } catch (err) {
        console.error(err);
        showFeedback('Erro ao exportar: ' + err.message, 'error');
    }
};

// --- Inicialização ---
function init() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        };
    });

    el.connectBtn.onclick = createClient;
    el.visualizarLayoutBtn.onclick = gerarLayoutVisual;
    el.exportLayoutPdfBtn.onclick = exportarLayoutPDF;
    el.fecharLayoutBtn.onclick = () => el.layoutContainer.classList.add('hidden');

    createClient();
}

init();
