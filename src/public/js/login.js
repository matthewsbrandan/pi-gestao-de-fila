//#region LOGIN
function login(event){
  event.preventDefault()

  if(event.target.classList.contains('is-loading')) return;
  
  event.target.classList.add('is-loading')

  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  if(!email || !password){
    notify('error', 'É obrigatório informa email e senha')
    return
  }

  fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password })
  }).then((response) => response.json()).then((data) => {
    notify(data.result ? 'success' : 'error', data.response)

    if(data.result) setTimeout(
      () => window.location.reload(), 2 * 1000
    )
  }).catch((err) => {
    notify('error', err.response ?? 'Houve um erro ao processar a resposta do login');
  }).finally(() => event.target.classList.remove('is-loading')) 
}
function loginToSignup(){
  document.querySelector('#modalSignin .btn-close').click()
  const modalSignup = new bootstrap.Modal(
    document.getElementById('modalSignup')
  )
  modalSignup.show()
}
//#endregion LOGIN
function signup(event){
  event.preventDefault()

  if(event.target.classList.contains('is-loading')) return;
  
  event.target.classList.add('is-loading')

  const name = document.getElementById('signup-name').value
  const email = document.getElementById('signup-email').value
  const phone = document.getElementById('signup-phone').value
  const password = document.getElementById('signup-password').value

  if(!name || !email || !password){
    notify('error', 'É obrigatório informa nome, email e senha')
    return
  }

  // [ ] REDIRECIONAR SE BEM SUCEDIDO

  fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone })
  }).then((response) => response.json()).then((data) => {
    notify(data.result ? 'success' : 'error', data.response)

    if(data.result){
      signupToLogin()

      document.getElementById('login-email').value = email
      document.getElementById('login-password').value = password
    }
  }).catch((err) => {
    notify('error', err.response ?? 'Houve um erro ao processar a resposta do login');
  }).finally(() => event.target.classList.remove('is-loading')) 
}
function signupToLogin(){
  document.querySelector('#modalSignup .btn-close').click()
  const modalSignin = new bootstrap.Modal(
    document.getElementById('modalSignin')
  )
  modalSignin.show()
}

const formLogin = document.getElementById('form-login')
if(formLogin) formLogin.addEventListener("submit", login);
const formSignup = document.getElementById('form-signup')
if(formSignup) formSignup.addEventListener("submit", signup);

//#region MASK
const signupPhone = document.getElementById('signup-phone');
if(signupPhone) signupPhone.addEventListener('input', function (event) {
  const input = event.target;
  const value = input.value.replace(/\D/g, '');
  if(value.length >= 10) input.value = value.replace(
    /(\d{2})(\d{0,5})(\d{4})/,
    '($1) $2-$3'
  ).slice(0, 15);
  else if(value.length > 5){
    input.value = value.replace(/(\d{0,5})(\d{0,4})/, '$1-$2').slice(0, 15);
  }
  else input.value = value
});
//#endregion MASK