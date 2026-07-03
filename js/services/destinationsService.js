import { destinosLatam } from '../../assets/data/destinosData.js';

export const obterDestinos = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (destinosLatam && destinosLatam.length > 0) {
                resolve(destinosLatam);
            } else {
                reject(new Error("Nenhum destino encontrado nos dados."));
            }
        }, 200);
    });
};