document.addEventListener("DOMContentLoaded", () => {
  // Verificar se está logado
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  if (isLoggedIn !== "true" && !window.location.href.includes("index.html")) {
    window.location.href = "index.html"
    return
  }

  // Exibir nome do usuário
  const userNameElement = document.getElementById("user-name")
  if (userNameElement) {
    const usuarioAtual = JSON.parse(localStorage.getItem("usuarioAtual") || "{}")
    userNameElement.textContent = usuarioAtual.nome || "Usuário"
  }

  // Configurar botão de logout
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.setItem("isLoggedIn", "false")
      window.location.href = "index.html"
    })
  }
})
