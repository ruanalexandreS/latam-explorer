import { destinosLatam } from '../services/destinationsService.js';

// Função auxiliar apenas para desenhar os cards no HTML
const desenharCards = (listaDestinos) => {
    const grid = document.getElementById('grid-destinos');
    if (!grid) return;

    grid.innerHTML = '';

    listaDestinos.forEach(destino => {
        const cardHTML = `
            <article class="card">
                <img src="${destino.img}" alt="${destino.cidade}, ${destino.pais}" class="card-img">
                <div class="card-content">
                    <h3>${destino.cidade}, ${destino.pais}</h3>
                    <p>${destino.desc}</p>
                    <a href="#" class="btn-link">Saiba Mais &rarr;</a>
                </div>
            </article>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
};

// Função principal exportada
export const renderizarDestinos = () => {
    const grid = document.getElementById('grid-destinos');
    const containerFiltros = document.getElementById('filtros-paises');

    if (!grid || !containerFiltros) return;

    // 1. Extrai países únicos e adiciona "Todos"
    const paisesUnicos = ['Todos', ...new Set(destinosLatam.map(item => item.pais))];

    // 2. Renderiza os botões de filtro
    containerFiltros.innerHTML = '';
    paisesUnicos.forEach(pais => {
        const btnHTML = `<button class="btn-filtro ${pais === 'Todos' ? 'active' : ''}" data-pais="${pais}">${pais}</button>`;
        containerFiltros.insertAdjacentHTML('beforeend', btnHTML);
    });

    // 3. Renderiza todos os cards inicialmente
    desenharCards(destinosLatam);

    // 4. Evento de clique nos filtros
    const botoesFiltro = containerFiltros.querySelectorAll('.btn-filtro');

    botoesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            botoesFiltro.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const paisSelecionado = btn.getAttribute('data-pais');

            if (paisSelecionado === 'Todos') {
                desenharCards(destinosLatam);
            } else {
                const destinosFiltrados = destinosLatam.filter(item => item.pais === paisSelecionado);
                desenharCards(destinosFiltrados);
            }
        });
    });
};