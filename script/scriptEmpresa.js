function toggleSenha() {
    let senhaInput = document.getElementById('senha');
    senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
}

function toggleSenhaConfirmacao() {
    let senhaInput = document.getElementById('confirmar_senha');
    senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
}

let nomeInput = document.getElementById('nome');
let emailInput = document.getElementById('email');
let cepInput = document.getElementById('cep');
let senhaInput = document.getElementById('senha');
let numeroInput = document.getElementById('numero');
let enderecoInput = document.getElementById('endereco');
let cnpjInput = document.getElementById('cnpj');
let areaInput = document.getElementById('area');
let confirmSenhaInput = document.getElementById('confirmar_senha');
let divMensagem = document.getElementById('divMensagem');

cnpjInput.addEventListener('input', function (event) {
    let cnpj = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (cnpj.length > 14) {
        cnpj = cnpj.slice(0, 14); // Garante que o CNPJ não tenha mais de 14 dígitos
    }

    event.target.value = cnpj
        .replace(/^(\d{2})(\d)/, '$1.$2')                 // Formata o CNPJ
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');

});

document.getElementById("cep").addEventListener("input", function () {
    let cep = this.value.replace(/\D/g, "");

    if (cep.length > 5) {
        this.value = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    } else {
        this.value = cep;
    }
});

document.getElementById("cep").addEventListener("input", function () {
    let cep = this.value.replace(/\D/g, "");

    if (cep.length > 5) {
        this.value = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    } else {
        this.value = cep;
    }
});

document.getElementById("cep").addEventListener("blur", async function () {
    let cep = this.value.replace(/\D/g, "");

    if (cep.length !== 8) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "CEP inválido! Deve conter 8 dígitos.";
        return;
    }

    try {
        let response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        let data = await response.json();

        if (data.erro) {
            document.getElementById("endereco").value = "CEP não encontrado!";
            return;
        }

        let enderecoFormatado = `${data.logradouro} - ${data.bairro}, ${data.localidade} - ${data.uf}`;

        document.getElementById("endereco").value = enderecoFormatado;

    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        document.getElementById("endereco").value = "Erro ao buscar o endereço. Tente novamente.";
    }
});

function validarCadastroEmpresa() {
    if (!nomeInput.value || !emailInput.value || !cepInput.value || !senhaInput.value || !numeroInput.value || !enderecoInput.value || !cnpjInput.value || !areaInput.value || !confirmSenhaInput.value) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "Todos os campos devem ser preenchidos."
        return false;
    }
    if (cnpjInput.value.length != 14) {
        divMensagem.style.display = "flex";
        divMensagem.innerText = "CNPJ inválido! Deve conter 14 dígitos.";
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
    if (senhaInput.value !== confirmSenhaInput.value) {
        divMensagem.style.display = "flex"
        divMensagem.innerText = "As senhas não são iguais.";
        return false;
    }

    return true;
}

async function cadastrarEmpresa() {
    event.preventDefault();
    if (!validarCadastroEmpresa()) return;

    const nome = nomeInput.value;
    const email = emailInput.value;
    const cep = cepInput.value;
    const senha = senhaInput.value;
    const numero = numeroInput.value;
    const endereco = enderecoInput.value;
    const cnpj = cnpjInput.value;
    const area = areaInput.value;

    try {
        const response = await fetch("http://localhost:3000/empresas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, cep, senha, numero, endereco, cnpj, area })
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
