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
let confirmSenhaInputInput = document.getElementById('confirmar_senha');

function validarCadastro() {
    if (!nomeInput.value || !emailInput.value || !senhaInput.value || !confirmSenhaInputInput.value) {
        alert("Todos os campos devem ser preenchidos.");
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
    if (senhaInput.value !== confirmSenhaInputInput.value) {
        alert("As senhas não são iguais.");
        return false;
    }

    return true; 
}

async function cadastrar() {
    event.preventDefault();
    if (!validarCadastro()) return;

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

async function logar(){
    event.preventDefault();
    
     const email = emailInput.value;
     const senha = senhaInput.value;
 
     if (!email || !senha) {
         alert("Por favor, preencha todos os campos.")
         return;
     }
 
     try {
         const response = await fetch("http://localhost:3000/users");
         const users = await response.json();
 
         const user = users.find(u => u.email === email);
 
         if (!user) {
             alert("Email não encontrado")
             return;
         }
 
         if (user.senha !== senha) {
             alert("Senha incorreta")
             return;
         }
 
         console.log("Usuário logado com sucesso:", user);
         
         window.location.href = "sim.html";
         
     } catch (error) {
         console.error("Erro ao realizar o login:", error);
         alert("Erro ao tentar fazer login. Tente novamente.")
     }
}
