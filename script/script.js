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
