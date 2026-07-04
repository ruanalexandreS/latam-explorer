// O serviço não manipula o DOM. Apenas fornece dados e cálculos.

// Taxas de fallback: usadas se a API falhar (valores aproximados)
const taxasFallback = {
    BRL: 1,
    USD: 0.18,
    EUR: 0.17,
    ARS: 175.50,
    CLP: 180.20,
    COP: 750.50,
    MXN: 3.30,
    PEN: 0.75,
    UYU: 7.80,
};

// Moedas que o projeto usa
const moedasSuportadas = ['BRL', 'USD', 'EUR', 'ARS', 'CLP', 'COP', 'MXN', 'PEN', 'UYU'];

// Cache em memória para não re-buscar a cada digitação
let taxasEmCache = null;

export const obterTaxas = async () => {
    if (taxasEmCache) return taxasEmCache;

    try {
        const resposta = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');

        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

        const dados = await resposta.json();

        // Monta o objeto de taxas garantindo TODAS as moedas suportadas:
        // o que a API não trouxer é completado com o fallback
        const taxas = {};
        for (const moeda of moedasSuportadas) {
            if (typeof dados.rates?.[moeda] === 'number') {
                taxas[moeda] = dados.rates[moeda];
            } else {
                console.warn(`Taxa de ${moeda} ausente na resposta da API. Usando valor de fallback.`);
                taxas[moeda] = taxasFallback[moeda];
            }
        }

        taxasEmCache = taxas;
        return taxasEmCache;

    } catch (erro) {
        console.warn("API de câmbio indisponível. Usando taxas de fallback.", erro);
        taxasEmCache = { ...taxasFallback };
        return taxasEmCache;
    }
};

// Converte qualquer moeda suportada para qualquer outra
export const calcularConversao = (valor, moedaOrigem, moedaDestino, taxas) => {
    const taxaOrigem = taxas[moedaOrigem];
    const taxaDestino = taxas[moedaDestino];

    if (typeof taxaOrigem !== 'number' || typeof taxaDestino !== 'number') return null;

    // Converte para BRL primeiro (base), depois para a moeda destino
    const valorEmBRL = valor / taxaOrigem;
    return valorEmBRL * taxaDestino;
};