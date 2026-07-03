export const inicializarContato = () => {
    const form = document.getElementById('formContato');
    const sucessoMsg = document.getElementById('sucesso-msg');

    if (!form) return;

    const campos = {
        nome: document.getElementById('nome'),
        email: document.getElementById('email'),
        mensagem: document.getElementById('mensagem'),
    };

    const erros = {
        nome: document.getElementById('erro-nome'),
        email: document.getElementById('erro-email'),
        mensagem: document.getElementById('erro-mensagem'),
    };

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const limparErros = () => {
        Object.values(erros).forEach(el => { if (el) el.textContent = ''; });
        sucessoMsg?.classList.remove('visivel');
    };

    const validar = () => {
        const nome = campos.nome?.value.trim() ?? '';
        const email = campos.email?.value.trim() ?? '';
        const mensagem = campos.mensagem?.value.trim() ?? '';

        let valido = true;

        if (nome.length < 3) {
            if (erros.nome) erros.nome.textContent = 'Insira um nome válido (mínimo 3 caracteres).';
            valido = false;
        }

        if (!regexEmail.test(email)) {
            if (erros.email) erros.email.textContent = 'Insira um e-mail válido.';
            valido = false;
        }

        if (mensagem.length < 10) {
            if (erros.mensagem) erros.mensagem.textContent = 'A mensagem deve ter pelo menos 10 caracteres.';
            valido = false;
        }

        return valido;
    };

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        limparErros();

        if (validar()) {
            form.reset();
            sucessoMsg?.classList.add('visivel');
        }
    });
};