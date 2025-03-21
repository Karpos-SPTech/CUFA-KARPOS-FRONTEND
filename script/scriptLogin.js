let nomeInput = document.getElementById('nome');
let emailInput = document.getElementById('email');
let senhaInput = document.getElementById('senha');

async function logar() {
    event.preventDefault();

    const email = emailInput.value;
    const senha = senhaInput.value;

    if (!email || !senha) {
        divMensagem.style.display = "flex";
        divMensagem.innerText = "Por favor, preencha todos os campos.";
        return;
    }
    if (!emailInput.value.includes("@") || !emailInput.value.includes(".com")) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "Por favor, insira um email válido.";
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
            divMensagem.style.display = "flex";
            divMensagem.innerText = "Email não encontrado.";
            return;
        }

        if (user && user.senha === senha) {
            console.log("Usuário logado com sucesso:", user);
            window.location.href = "cufaSystem.html";
            return;
        }

        if (empresa && empresa.senha === senha) {
            console.log("Empresa logada com sucesso:", empresa);
            window.location.href = "cufaSystem.html";
            return;
        }

        divMensagem.style.display = "flex";
        divMensagem.innerText = "Senha incorreta.";

    } catch (error) {
        console.error("Erro ao realizar o login:", error);
        divMensagem.style.display = "flex";
        divMensagem.innerText = "Erro ao tentar fazer login. Tente novamente.";
    }
}

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
        window.location.href = "cufaSystem.html";
    } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        divMensagem.style.display = "flex";
        divMensagem.innerText = "Erro ao salvar usuário. Tente novamente.";
    }
}
