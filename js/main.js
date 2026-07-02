import { inicializarConversor } from './controllers/converterController.js';
import { inicializarMenu } from './controllers/menuController.js';
import { inicializarContato } from './controllers/contactController.js';
import { renderizarDestinos } from './controllers/destinationsController.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarMenu();
    inicializarConversor();
    inicializarContato();
    renderizarDestinos();
});