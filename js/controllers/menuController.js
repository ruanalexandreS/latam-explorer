export const inicializarMenu = () => {
    const btnMenu = document.getElementById('btn-mobile');
    const menu = document.getElementById('menu');

    if (!btnMenu || !menu) return;

    const abrirFechar = () => menu.classList.toggle('active');
    const fechar = () => menu.classList.remove('active');

    // Abre/fecha ao clicar no botão hambúrguer
    btnMenu.addEventListener('click', (evento) => {
        evento.stopPropagation();
        abrirFechar();
    });

    // Fecha ao clicar em qualquer link do menu
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', fechar);
    });

    // Fecha ao clicar fora do menu e do botão
    document.addEventListener('click', (evento) => {
        if (!menu.contains(evento.target) && !btnMenu.contains(evento.target)) {
            fechar();
        }
    });
};