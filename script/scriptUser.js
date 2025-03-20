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

async function validarCadastroUsuario() {
    if (!nomeInput.value || !emailInput.value || !senhaInput.value || !confirmSenhaInput.value) {
        alert("Todos os campos devem ser preenchidos.");
        return false;
    }
    if (!emailInput.value.includes("@") || !emailInput.value.includes(".com")) {
        alert("Por favor, insira um email válido.");
        return false;
    }
    if (senhaInput.value.length < 8) {
        alert("A senha deve ter pelo menos 8 caracteres.");
        return false;
    }
    if (!/[A-Z]/.test(senhaInput.value)) {
        alert("A senha deve conter pelo menos uma letra maiúscula.");
        return false;
    }
    if (!/\d/.test(senhaInput.value)) {
        alert("A senha deve conter pelo menos um número.");
        return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senhaInput.value)) {
        alert("A senha deve conter pelo menos um caractere especial.");
        return false;
    }
    if (senhaInput.value !== confirmSenhaInput.value) {
        alert("As senhas não são iguais.");
        return false;
    }

    return true;
}

async function cadastrarUsuario() {
    event.preventDefault();
    if (!validarCadastroUsuario()) return;

    const nome = nomeInput.value;
    const email = emailInput.value;
    const senha = senhaInput.value;

    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário.");
        }

        const data = await response.json();
        console.log("Usuário cadastrado:", data);

        window.location.href = "login.html";

    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar usuário.");
    }
}

async function logar() {
    event.preventDefault();

    const email = emailInput.value;
    const senha = senhaInput.value;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const [usersResponse, empresasResponse] = await Promise.all([
            fetch("http://localhost:3000/users"),
            fetch("http://localhost:3000/empresas")
        ]);

        const users = await usersResponse.json();
        const empresas = await empresasResponse.json();

        const user = users.find(u => u.email === email);
        const empresa = empresas.find(e => e.email === email);

        if (!user && !empresa) {
            alert("Email não encontrado.");
            return;
        }

        if (user && user.senha === senha) {
            console.log("Usuário logado com sucesso:", user);
            window.location.href = "sim.html";
            return;
        }

        if (empresa && empresa.senha === senha) {
            console.log("Empresa logada com sucesso:", empresa);
            window.location.href = "sim.html";
            return;
        }

        alert("Senha incorreta.");

    } catch (error) {
        console.error("Erro ao realizar o login:", error);
        alert("Erro ao tentar fazer login. Tente novamente.");
    }
}

// function logarComGoogle() {
//     event.preventDefault();
//     google.accounts.id.prompt();
// }

function handleCredentialResponse(response) {
    const credential = response.credential;
    
    const userData = parseJwt(credential);
    
    console.log("Usuário logado:", userData);

    const novoUsuario = {
        nome: userData.name,
        email: userData.email,
        senha: userData.sub
    };

    salvarUsuario(novoUsuario);
}

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    return JSON.parse(jsonPayload);
}
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "296975099929-nnk3hihf30cdoh9qfveb1map9qt1h6c6.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        login_uri: "http://localhost:5500/pages/login.html"
    });

    google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        { 
            theme: "outline",
            size: "large",
            shape: "circle",
            text: "continue_with"
        }
    );

    google.accounts.id.prompt();
};

async function salvarUsuario(usuario) {
    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar usuário.");
        }

        console.log("Usuário salvo com sucesso!");
        window.location.href = "sim.html";
    } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        alert("Erro ao salvar usuário. Tente novamente.");
    }
}
