import { obterDestinos } from '../services/destinationsService.js';

export const inicializarDestinos = async () => {
    const grid = document.getElementById('grid-destinos');
    const filtrosContainer = document.getElementById('filtros-paises');
    const inputBusca = document.getElementById('input-busca');
    const modal = document.getElementById('modal-destino');

    if (!grid || !filtrosContainer) return;

    let destinos = [];
    let categoriaAtual = 'Todos';
    let termoBusca = '';

    // --- Modal ---

    const abrirModal = (id) => {
        const item = destinos.find(d => d.id === id);
        if (!item || !modal) return;

        document.getElementById('modal-titulo').textContent = item.cidade;
        document.getElementById('modal-pais').textContent = item.pais;
        document.getElementById('modal-desc').textContent = item.desc;
        document.getElementById('modal-roteiro').textContent =
            item.roteiro || 'Dia 1: Tour histórico. Dia 2: Atrações principais. Dia 3: Gastronomia e cultura.';
        document.getElementById('modal-gasto').textContent =
            item.gastoDiarioEstimado || 'Aprox. USD 50 - USD 80 por dia.';

        modal.classList.add('active');
    };

    const fecharModal = () => modal?.classList.remove('active');

    // Delegação de eventos no grid — um único listener para todos os botões
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-modal');
        if (!btn) return;
        abrirModal(parseInt(btn.dataset.id));
    });

    document.getElementById('btn-fechar-modal')?.addEventListener('click', fecharModal);

    // Fecha ao clicar fora da caixa do modal
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // --- Renderização ---

    const criarCardHTML = (item) => `
        <div class="card">
            <img class="card-img" src="${item.img}" alt="Foto de ${item.cidade}">
            <div class="card-content">
                <span class="card-pais">${item.pais}</span>
                <h3>${item.cidade}</h3>
                <p>${item.desc}</p>
                <button class="btn-modal btn btn-primary" data-id="${item.id}">Saiba Mais</button>
            </div>
        </div>
    `;

    const renderizar = () => {
        const listaFiltrada = destinos.filter(item => {
            const passaCategoria = categoriaAtual === 'Todos' || item.pais === categoriaAtual;
            const passaBusca =
                item.cidade.toLowerCase().includes(termoBusca) ||
                item.pais.toLowerCase().includes(termoBusca) ||
                item.desc.toLowerCase().includes(termoBusca);
            return passaCategoria && passaBusca;
        });

        if (listaFiltrada.length === 0) {
            grid.innerHTML = '<p class="grid-vazio">Nenhum destino encontrado para a busca.</p>';
            return;
        }

        grid.innerHTML = listaFiltrada.map(criarCardHTML).join('');
    };

    // --- Filtros ---

    const criarFiltros = () => {
        const categorias = ['Todos', ...new Set(destinos.map(d => d.pais))];

        categorias.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = cat;
            btn.className = `btn-filtro ${cat === 'Todos' ? 'active' : ''}`;
            btn.addEventListener('click', () => {
                filtrosContainer.querySelectorAll('.btn-filtro')
                    .forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                categoriaAtual = cat;
                renderizar();
            });
            filtrosContainer.appendChild(btn);
        });
    };

    // --- Busca ---

    inputBusca?.addEventListener('input', (e) => {
        termoBusca = e.target.value.toLowerCase().trim();
        renderizar();
    });

    // --- Inicialização ---

    grid.innerHTML = '<p class="grid-vazio">Carregando destinos...</p>';

    try {
        destinos = await obterDestinos();
        criarFiltros();
        renderizar();
    } catch (erro) {
        console.error("Falha ao carregar os destinos:", erro);
        grid.innerHTML = '<p class="grid-vazio">Erro ao carregar os destinos. Tente novamente mais tarde.</p>';
    }
};