// Dicionário de taxas simuladas em relação a 1 BRL
const taxasEmBRL = {
    BRL: 1,
    USD: 0.18,
    EUR: 0.16,
    ARS: 175.50,
    CLP: 180.20,
    COP: 750.50,
    MXN: 3.30,
    PEN: 0.75,
    UYU: 7.80
};

export const inicializarConversor = () => {
    const inputOrigem = document.getElementById('valorOrigem');
    const inputDestino = document.getElementById('valorDestino');
    const selectOrigem = document.getElementById('moedaOrigem');
    const selectDestino = document.getElementById('moedaDestino');
    const labelTaxa = document.getElementById('label-taxa');
    const btnInverter = document.getElementById('btn-inverter');

    // Verifica elementos essenciais antes de adicionar listeners
    if (!inputOrigem || !inputDestino || !selectOrigem || !selectDestino || !labelTaxa) return;

    // --- NOVO: Resgata a última moeda salva ao carregar a ferramenta ---
    const moedaSalva = localStorage.getItem('latam_moeda_destino');
    if (moedaSalva) {
        // Verifica se a moeda salva realmente existe nas opções do select para evitar erros
        const opcaoExiste = Array.from(selectDestino.options).some(opt => opt.value === moedaSalva);
        if (opcaoExiste) {
            selectDestino.value = moedaSalva;
        }
    }

    // 1. Função de Cálculo em Tempo Real
    const calcular = () => {
        const valor = parseFloat(inputOrigem.value);
        const moedaDe = selectOrigem.value;
        const moedaPara = selectDestino.value;

        // Protege contra moedas desconhecidas
        if (!taxasEmBRL[moedaDe] || !taxasEmBRL[moedaPara]) {
            labelTaxa.textContent = `-`;
            inputDestino.value = "0.00";
            return;
        }

        // Atualiza a legenda de taxa comercial no topo
        const taxaDireta = (1 / taxasEmBRL[moedaDe]) * taxasEmBRL[moedaPara];
        labelTaxa.textContent = `$1 ${moedaDe} = ${taxaDireta.toFixed(2)} ${moedaPara}`;

        if (isNaN(valor) || valor < 0) {
            inputDestino.value = "0.00";
            return;
        }

        // Converte primeiro para BRL (base) e depois para a moeda destino
        const valorEmBRL = valor / taxasEmBRL[moedaDe];
        const resultadoFinal = valorEmBRL * taxasEmBRL[moedaPara];

        inputDestino.value = resultadoFinal.toFixed(2);
    };

    // 2. Eventos que disparam o cálculo instantaneamente
    inputOrigem.addEventListener('input', calcular);
    selectOrigem.addEventListener('change', calcular);

    // --- NOVO: Salva no LocalStorage e calcula ao mudar a moeda destino ---
    selectDestino.addEventListener('change', () => {
        localStorage.setItem('latam_moeda_destino', selectDestino.value);
        calcular();
    });

    // 3. Botão Inverter Moedas
    if (btnInverter) {
        btnInverter.addEventListener('click', () => {
            const tempMoeda = selectOrigem.value;
            selectOrigem.value = selectDestino.value;
            selectDestino.value = tempMoeda;
            calcular();
        });
    }

    // 4. Lógica Interativa do FAQ (Sanfona/Accordion)
    const botoesFaq = document.querySelectorAll('.faq-pergunta');
    botoesFaq.forEach(botao => {
        botao.addEventListener('click', () => {
            const item = botao.parentElement;
            if (!item) return;
            const resposta = item.querySelector('.faq-resposta');
            const estaAtivo = item.classList.contains('active');

            // Fecha todos os outros antes de abrir o clicado
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
                const r = el.querySelector('.faq-resposta');
                const p = el.querySelector('.faq-pergunta');
                if (r) r.style.maxHeight = null;
                if (p) p.setAttribute('aria-expanded', 'false');
            });

            // Se não estava ativo, abre a resposta calculando a altura do texto
            if (!estaAtivo && resposta) {
                item.classList.add('active');
                resposta.style.maxHeight = resposta.scrollHeight + "px";
                botao.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Executa o primeiro cálculo ao abrir a página (Já vai usar a moeda salva se houver)
    calcular();
};