import { inicializarConversor } from './controllers/converterController.js';
import { inicializarMenu } from './controllers/menuController.js';
import { inicializarContato } from './controllers/contactController.js';
import { inicializarDestinos } from './controllers/destinationsController.js';
import { inicializarTema } from './controllers/themeController.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarMenu();
    inicializarConversor();
    inicializarContato();
    inicializarTema();
    inicializarDestinos();
});