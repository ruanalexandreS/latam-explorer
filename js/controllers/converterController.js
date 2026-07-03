import { obterTaxas, calcularConversao } from '../services/currencyService.js';

export const inicializarConversor = async () => {
    const inputOrigem = document.getElementById('valorOrigem');
    const inputDestino = document.getElementById('valorDestino');
    const selectOrigem = document.getElementById('moedaOrigem');
    const selectDestino = document.getElementById('moedaDestino');
    const labelTaxa = document.getElementById('label-taxa');
    const btnInverter = document.getElementById('btn-inverter');

    if (!inputOrigem || !inputDestino || !selectOrigem || !selectDestino || !labelTaxa) return;

    // --- Restaura última moeda destino salva ---
    const moedaSalva = localStorage.getItem('latam_moeda_destino');
    if (moedaSalva) {
        const opcaoExiste = Array.from(selectDestino.options).some(opt => opt.value === moedaSalva);
        if (opcaoExiste) selectDestino.value = moedaSalva;
    }

    // --- Busca taxas reais (com fallback automático no service) ---
    labelTaxa.textContent = 'Carregando taxa...';
    let taxas = {};

    try {
        taxas = await obterTaxas();
    } catch (erro) {
        console.error('Erro ao obter taxas:', erro);
        labelTaxa.textContent = 'Taxa indisponível.';
        return;
    }

    // --- Cálculo ---
    const calcular = () => {
        const valor = parseFloat(inputOrigem.value);
        const moedaDe = selectOrigem.value;
        const moedaPara = selectDestino.value;

        const taxaDireta = calcularConversao(1, moedaDe, moedaPara, taxas);

        if (taxaDireta === null) {
            labelTaxa.textContent = 'Taxa indisponível.';
            inputDestino.value = '';
            return;
        }

        labelTaxa.textContent = `1 ${moedaDe} = ${taxaDireta.toFixed(2)} ${moedaPara}`;

        if (isNaN(valor) || valor < 0) {
            inputDestino.value = '';
            return;
        }

        const resultado = calcularConversao(valor, moedaDe, moedaPara, taxas);
        inputDestino.value = resultado !== null ? resultado.toFixed(2) : '';
    };

    // --- Eventos ---
    inputOrigem.addEventListener('input', calcular);
    selectOrigem.addEventListener('change', calcular);

    selectDestino.addEventListener('change', () => {
        localStorage.setItem('latam_moeda_destino', selectDestino.value);
        calcular();
    });

    btnInverter?.addEventListener('click', () => {
        [selectOrigem.value, selectDestino.value] = [selectDestino.value, selectOrigem.value];
        calcular();
    });

    calcular();
};
// =============================================================================
// FAQ Accordion — separado do conversor, mas na mesma página (ferramentas.html)
// =============================================================================
export const inicializarFaq = () => {
    document.querySelectorAll('.faq-pergunta').forEach(botao => {
        botao.addEventListener('click', () => {
            const item = botao.parentElement;
            const resposta = item?.querySelector('.faq-resposta');
            if (!item || !resposta) return;

            const estaAtivo = item.classList.contains('active');

            // Fecha todos
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
                const r = el.querySelector('.faq-resposta');
                const p = el.querySelector('.faq-pergunta');
                if (r) r.style.maxHeight = null;
                if (p) p.setAttribute('aria-expanded', 'false');
            });

            // Abre o clicado (se estava fechado)
            if (!estaAtivo) {
                item.classList.add('active');
                resposta.style.maxHeight = resposta.scrollHeight + 'px';
                botao.setAttribute('aria-expanded', 'true');
            }
        });
    });
};