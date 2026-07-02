export const inicializarContato = () => {
    const form = document.getElementById('formContato');
    if (!form) return;

    form.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Impede o recarregamento da página

        let formValido = true;
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        // Limpa erros anteriores
        document.querySelectorAll('.erro').forEach(el => el.textContent = '');
        document.getElementById('sucesso-msg').style.display = 'none';

        // Validação de Nome (Mínimo 3 caracteres)
        if (nome.length < 3) {
            document.getElementById('erro-nome').textContent = 'Insira um nome válido.';
            document.getElementById('erro-nome').style.color = 'red';
            formValido = false;
        }

        // Validação de E-mail (Regex básico)
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            document.getElementById('erro-email').textContent = 'Insira um e-mail válido.';
            document.getElementById('erro-email').style.color = 'red';
            formValido = false;
        }

        // Validação de Mensagem (Mínimo 10 caracteres)
        if (mensagem.length < 10) {
            document.getElementById('erro-mensagem').textContent = 'A mensagem deve ter pelo menos 10 caracteres.';
            document.getElementById('erro-mensagem').style.color = 'red';
            formValido = false;
        }

        if (formValido) {
            document.getElementById('sucesso-msg').style.display = 'block';
            form.reset(); // Limpa os campos
        }
    });
};