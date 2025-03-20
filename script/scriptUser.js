function toggleSenha() {
    let senhaInput = document.getElementById('senha');
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
    } else {
        senhaInput.type = 'password';
    }
}
function toggleSenhaConfirmacao() {
    let senhaInput = document.getElementById('confirmar_senha');
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
    } else {
        senhaInput.type = 'password';
    }
}

let nomeInput = document.getElementById('nome');
let emailInput = document.getElementById('email');
let senhaInput = document.getElementById('senha');
let confirmSenhaInput = document.getElementById('confirmar_senha');
let divMensagem = document.getElementById('divMensagem');

function validarCadastroUsuario() {
    if (!nomeInput.value || !emailInput.value || !senhaInput.value || !confirmSenhaInput.value) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "Todos os campos devem ser preenchidos."
        return false;
    }
    if (!emailInput.value.includes("@") || !emailInput.value.includes(".com")) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "Por favor, insira um email válido.";
        return false;
    }
    if (senhaInput.value.length < 8) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "A senha deve ter pelo menos 8 caracteres.";
        return false;
    }
    if (!/[A-Z]/.test(senhaInput.value)) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "A senha deve conter pelo menos uma letra maiúscula.";
        return false;
    }
    if (!/\d/.test(senhaInput.value)) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "A senha deve conter pelo menos um número.";
        return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senhaInput.value)) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "A senha deve conter pelo menos um caractere especial.";
        return false;
    }
    if (senhaInput.value != confirmSenhaInput.value) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "As senhas não são iguais.";
        return false;
    }
    return true;
}

function cadastrarUsuario() {
    event.preventDefault();
    if (!validarCadastroUsuario()) {
        return;
    }

    const nome = nomeInput.value;
    const email = emailInput.value;
    const senha = senhaInput.value;

    try {
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao cadastrar usuário.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Usuário cadastrado:", data);
            window.location.href = "login.html";
        })
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        divMensagem.style.display = "flex";
        divMensagem.innerText = "Erro ao cadastrar usuário";
    }
}

