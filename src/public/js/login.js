function login(event){
  event.preventDefault()

  console.log(event.target);

  if(event.target.classList.contains('is-loading')) return;
  
  event.target.classList.add('is-loading')

  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  if(!email || !password){
    notify('error', 'É obrigatório informa email e senha')
    return
  }
  // [ ] COLOCAR SPINER NO BOTÃO
  // [ ] DAR FEEDBACK COM TOAST
  // [ ] REDIRECIONAR SE BEM SUCEDIDO

  fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password })
  }).then((response) => response.json()).then((data) => {
    notify(data.result ? 'success' : 'error', data.response)
  }).catch((err) => {
    notify('error', err.response ?? 'Houve um erro ao processar a resposta do login');
  }).finally(() => event.target.classList.remove('is-loading')) 
}

document.getElementById('form-login').addEventListener("submit", login);