import { obterDestinos } from '../services/destinationsService.js';

export const inicializarDestinos = async () => {
    const grid = document.getElementById('grid-destinos');
    const filtrosContainer = document.getElementById('filtros-paises');
    const inputBusca = document.getElementById('input-busca');
    const modal = document.getElementById('modal-destino');

    if (!grid || !filtrosContainer) return;

    grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Carregando destinos...</p>';

    const destinos = await obterDestinos();

    let categoriaAtual = 'Todos';
    let termoBusca = '';

    // 2. Lógica para popular e abrir o Modal
    const abrirModal = (id) => {
        const item = destinos.find(d => d.id === id);
        if (!item || !modal) return;

        document.getElementById('modal-titulo').textContent = item.cidade;
        document.getElementById('modal-pais').textContent = item.pais;
        document.getElementById('modal-desc').textContent = item.desc;

        // Fallbacks caso o array de dados não tenha as propriedades específicas
        document.getElementById('modal-roteiro').textContent = item.roteiro || 'Dia 1: Tour histórico. Dia 2: Atrações principais. Dia 3: Gastronomia e cultura.';
        document.getElementById('modal-gasto').textContent = item.gastoDiarioEstimado || 'Aprox. USD 50 - USD 80 por dia.';

        modal.classList.add('active');
    };

    const renderizar = () => {
        grid.innerHTML = '';

        // Filtro combinado: País selecionado + Texto digitado
        const listaFiltrada = destinos.filter(item => {
            const passaCategoria = categoriaAtual === 'Todos' || item.pais === categoriaAtual;
            const passaBusca = item.cidade.toLowerCase().includes(termoBusca) ||
                item.pais.toLowerCase().includes(termoBusca) ||
                item.desc.toLowerCase().includes(termoBusca);
            return passaCategoria && passaBusca;
        });

        if (listaFiltrada.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum destino encontrado para a busca.</p>';
            return;
        }

        listaFiltrada.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'feature-card';
            // Usa o index como ID fallback caso o array não tenha a propriedade 'id'
            const itemId = item.id || index;
            card.innerHTML = `
                <img src="${item.img}" alt="${item.cidade}" style="width:100%; height:180px; object-fit:cover; border-radius:6px;">
                <h3 style="margin-top:0.8rem;">${item.cidade}</h3>
                <span style="display:inline-block; font-size:0.8rem; font-weight:bold; color:var(--secondary-color); margin-bottom:0.5rem;">${item.pais}</span>
                <p style="font-size:0.9rem; line-height:1.4; margin-bottom: 1rem;">${item.desc}</p>
                <button class="btn-modal" data-id="${itemId}" style="width:100%; padding:0.6rem; border:none; border-radius:6px; background:#2c3e50; color:#fff; cursor:pointer; font-weight:bold;">Saiba Mais</button>
            `;
            grid.appendChild(card);
        });

        // Adiciona evento aos novos botões renderizados
        document.querySelectorAll('.btn-modal').forEach(btn => {
            btn.addEventListener('click', (e) => abrirModal(parseInt(e.target.getAttribute('data-id'))));
        });
    };

    // Geração dos botões de categoria (país)
    const categorias = ['Todos', ...new Set(destinos.map(d => d.pais))];
    filtrosContainer.innerHTML = '';

    categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = `btn-filtro ${cat === 'Todos' ? 'active' : ''}`;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            categoriaAtual = cat;
            renderizar();
        });
        filtrosContainer.appendChild(btn);
    });

    // Evento de digitação em tempo real na barra de busca
    inputBusca?.addEventListener('input', (e) => {
        termoBusca = e.target.value.toLowerCase().trim();
        renderizar();
    });

    // 3. Eventos para fechar o Modal (Botão X ou clique fora da caixa)
    document.getElementById('btn-fechar-modal')?.addEventListener('click', () => {
        modal?.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal?.classList.remove('active');
    });

    renderizar();
};