import { destinosLatam } from '../../assets/data/destinosData.js';

export const obterDestinos = async () => {
    try {
        // Simula uma requisição assíncrona com 200ms de delay (opcional)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(destinosLatam);
            }, 200);
        });
    } catch (erro) {
        console.error("Falha ao carregar os destinos:", erro);
        return [];
    }
};