export const inicializarMenu = () => {
    const btnMobile = document.getElementById('btn-mobile');
    const menu = document.getElementById('menu');

    if (btnMobile && menu) {
        btnMobile.addEventListener('click', () => {
            menu.classList.toggle('active');
            const isActive = menu.classList.contains('active');
            btnMobile.setAttribute('aria-expanded', isActive);
        });
    }
};