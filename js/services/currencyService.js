// O serviço não manipula o DOM. Apenas fornece dados e cálculos.
const taxasCambio = { ARS: 175.50, CLP: 180.20, COP: 750.50, MXN: 3.30, PEN: 0.75, UYU: 7.80 };

export const calcularConversao = (valorBRL, siglaMoeda) => {
    const taxa = taxasCambio[siglaMoeda];
    if (typeof taxa !== 'number') return null;
    return valorBRL * taxa;
};