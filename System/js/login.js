document.addEventListener("DOMContentLoaded", () => {
  // Verificar se já está logado
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  if (isLoggedIn === "true") {
    window.location.href = "dashboard.html"
  }

  // Configurar usuário padrão se não existir
  if (!localStorage.getItem("usuarios")) {
    const usuariosPadrao = [
      {
        username: "admin",
        password: "admin123",
        nome: "Administrador",
      },
    ]
    localStorage.setItem("usuarios", JSON.stringify(usuariosPadrao))
  }

  // Manipular login
  const loginBtn = document.getElementById("login-btn")
  const loginError = document.getElementById("login-error")

  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const remember = document.getElementById("remember").checked

    if (!username || !password) {
      loginError.textContent = "Por favor, preencha todos os campos."
      loginError.style.display = "block"
      return
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios"))
    const usuario = usuarios.find((u) => u.username === username && u.password === password)

    if (usuario) {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem(
        "usuarioAtual",
        JSON.stringify({
          username: usuario.username,
          nome: usuario.nome,
        }),
      )

      window.location.href = "dashboard.html"
    } else {
      loginError.textContent = "Usuário ou senha incorretos."
      loginError.style.display = "block"
    }
  })
})
