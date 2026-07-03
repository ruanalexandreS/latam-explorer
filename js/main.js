import { inicializarConversor } from './controllers/converterController.js';
import { inicializarMenu } from './controllers/menuController.js';
import { inicializarContato } from './controllers/contactController.js';
import { inicializarDestinos } from './controllers/destinationsController.js';
import { inicializarTema } from './controllers/themeController.js';
import { inicializarConversor, inicializarFaq } from './controllers/converterController.js';


document.addEventListener('DOMContentLoaded', () => {

    // Globais: presentes em TODAS as páginas
    inicializarMenu();
    inicializarTema();

    // Página Ferramentas: conversor de moedas
    if (document.getElementById('valorOrigem')) {
        inicializarConversor();
    }

    // Página Contato: formulário
    if (document.getElementById('formContato')) {
        inicializarContato();
    }

    // Página Destinos: grid + filtros + modal
    if (document.getElementById('grid-destinos')) {
        inicializarDestinos();
    }

    if (document.querySelector('.faq-pergunta')) {
        inicializarFaq();
    }

});