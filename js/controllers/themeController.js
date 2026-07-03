// Aplicação imediata do tema salvo — evita flash branco ao carregar a página
// Este bloco roda antes do DOMContentLoaded, por isso fica no topo do módulo
const temaSalvo = localStorage.getItem('latam_theme') || 'light';
document.documentElement.setAttribute('data-theme', temaSalvo);

const ROTULOS = {
    dark: '☀️ Modo Claro',
    light: '🌙 Modo Escuro',
};

export const inicializarTema = () => {
    const btnTheme = document.getElementById('btn-theme');

    if (!btnTheme) return;

    // Sincroniza o rótulo do botão com o tema já aplicado
    btnTheme.textContent = ROTULOS[temaSalvo];

    btnTheme.addEventListener('click', () => {
        const temaAtual = document.documentElement.getAttribute('data-theme');
        const novoTema = temaAtual === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', novoTema);
        localStorage.setItem('latam_theme', novoTema);
        btnTheme.textContent = ROTULOS[novoTema];
    });
};