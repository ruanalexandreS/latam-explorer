export const inicializarTema = () => {
    const btnTheme = document.getElementById('btn-theme');
    const temaSalvo = localStorage.getItem('latam_theme');

    // Aplica o tema imediatamente ao abrir a página
    if (temaSalvo === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (btnTheme) btnTheme.textContent = '☀️ Claro';
    }

    btnTheme?.addEventListener('click', () => {
        const temaAtual = document.documentElement.getAttribute('data-theme');
        if (temaAtual === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('latam_theme', 'light');
            btnTheme.textContent = '🌙 Escuro';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('latam_theme', 'dark');
            btnTheme.textContent = '☀️ Claro';
        }
    });
};