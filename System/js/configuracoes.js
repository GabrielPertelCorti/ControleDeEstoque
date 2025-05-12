document.addEventListener("DOMContentLoaded", () => {
  // Configurar tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"))

      this.classList.add("active")
      document.getElementById(`tab-${this.dataset.tab}`).classList.add("active")
    })
  })

  // Carregar configurações
  carregarConfiguracoes()

  // Configurar botões
  document.getElementById("btn-salvar-geral").addEventListener("click", salvarConfiguracoesGerais)
  document.getElementById("btn-salvar-estoque").addEventListener("click", salvarConfiguracoesEstoque)
  document.getElementById("btn-exportar").addEventListener("click", exportarDados)
  document.getElementById("importar-dados").addEventListener("change", importarDados)
  document.getElementById("btn-limpar-dados").addEventListener("click", limparDados)
  document.getElementById("btn-dados-exemplo").addEventListener("click", carregarDadosExemplo)
})

function carregarConfiguracoes() {
  const configuracoes = JSON.parse(localStorage.getItem("configuracoes") || "{}")

  // Configurações gerais
  if (configuracoes.nomeLoja) {
    document.getElementById("nome-loja").value = configuracoes.nomeLoja
  }

  if (configuracoes.moeda) {
    document.getElementById("moeda").value = configuracoes.moeda
  }

  if (configuracoes.tema) {
    document.getElementById("tema").value = configuracoes.tema
  }

  // Configurações de estoque
  if (configuracoes.estoqueMinimoPadrao) {
    document.getElementById("estoque-minimo-padrao").value = configuracoes.estoqueMinimoPadrao
  }

  if (configuracoes.alertaEstoqueBaixo !== undefined) {
    document.getElementById("alerta-estoque-baixo").checked = configuracoes.alertaEstoqueBaixo
  }
}

function salvarConfiguracoesGerais() {
  const configuracoes = JSON.parse(localStorage.getItem("configuracoes") || "{}")

  configuracoes.nomeLoja = document.getElementById("nome-loja").value
  configuracoes.moeda = document.getElementById("moeda").value
  configuracoes.tema = document.getElementById("tema").value

  localStorage.setItem("configuracoes", JSON.stringify(configuracoes))

  exibirMensagem("Configurações gerais salvas com sucesso!", "sucesso")
}

function salvarConfiguracoesEstoque() {
  const configuracoes = JSON.parse(localStorage.getItem("configuracoes") || "{}")

  configuracoes.estoqueMinimoPadrao = Number.parseInt(document.getElementById("estoque-minimo-padrao").value)
  configuracoes.alertaEstoqueBaixo = document.getElementById("alerta-estoque-baixo").checked

  localStorage.setItem("configuracoes", JSON.stringify(configuracoes))

  exibirMensagem("Configurações de estoque salvas com sucesso!", "sucesso")
}

function exportarDados() {
  try {
    const produtos = localStorage.getItem("produtos") || "[]"
    const configuracoes = localStorage.getItem("configuracoes") || "{}"

    const dados = {
      produtos: JSON.parse(produtos),
      configuracoes: JSON.parse(configuracoes),
      dataExportacao: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `cosmeticos-backup-${new Date().toLocaleDateString().replace(/\//g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    exibirMensagem("Dados exportados com sucesso!", "sucesso")
  } catch (error) {
    exibirMensagem("Erro ao exportar dados", "erro")
  }
}

function importarDados(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const conteudo = event.target.result
      const dados = JSON.parse(conteudo)

      if (dados.produtos && Array.isArray(dados.produtos)) {
        localStorage.setItem("produtos", JSON.stringify(dados.produtos))
      }

      if (dados.configuracoes) {
        localStorage.setItem("configuracoes", JSON.stringify(dados.configuracoes))
        carregarConfiguracoes()
      }

      exibirMensagem("Dados importados com sucesso!", "sucesso")
    } catch (error) {
      exibirMensagem("Erro ao importar dados. Formato inválido.", "erro")
    }
  }

  reader.readAsText(file)
}

function limparDados() {
  if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
    localStorage.removeItem("produtos")
    exibirMensagem("Dados limpos com sucesso!", "sucesso")
  }
}

function carregarDadosExemplo() {
  if (confirm("Isso substituirá todos os produtos existentes. Deseja continuar?")) {
    const produtosExemplo = [
      {
        id: 1,
        nome: "Batom Matte",
        quantidade: 45,
        preco: 29.9,
        categoria: "Maquiagem",
        estoqueMinimo: 10,
        custo: 15.5,
        valorVenda: 29.9,
      },
      {
        id: 2,
        nome: "Base Líquida",
        quantidade: 32,
        preco: 59.9,
        categoria: "Maquiagem",
        estoqueMinimo: 15,
        custo: 28.5,
        valorVenda: 59.9,
      },
      {
        id: 3,
        nome: "Máscara de Cílios",
        quantidade: 28,
        preco: 39.9,
        categoria: "Maquiagem",
        estoqueMinimo: 10,
        custo: 18.75,
        valorVenda: 39.9,
      },
      {
        id: 4,
        nome: "Hidratante Facial",
        quantidade: 5,
        preco: 49.9,
        categoria: "Skincare",
        estoqueMinimo: 10,
        custo: 22.5,
        valorVenda: 49.9,
      },
      {
        id: 5,
        nome: "Esmalte",
        quantidade: 60,
        preco: 12.9,
        categoria: "Unhas",
        estoqueMinimo: 20,
        custo: 5.8,
        valorVenda: 12.9,
      },
      {
        id: 6,
        nome: "Protetor Solar FPS 50",
        quantidade: 8,
        preco: 69.9,
        categoria: "Skincare",
        estoqueMinimo: 15,
        custo: 32.5,
        valorVenda: 69.9,
      },
      {
        id: 7,
        nome: "Shampoo Hidratante",
        quantidade: 25,
        preco: 35.9,
        categoria: "Cabelo",
        estoqueMinimo: 12,
        custo: 16.8,
        valorVenda: 35.9,
      },
      {
        id: 8,
        nome: "Condicionador",
        quantidade: 22,
        preco: 32.9,
        categoria: "Cabelo",
        estoqueMinimo: 12,
        custo: 15.4,
        valorVenda: 32.9,
      },
      {
        id: 9,
        nome: "Perfume Floral",
        quantidade: 12,
        preco: 120,
        categoria: "Perfumaria",
        estoqueMinimo: 5,
        custo: 58,
        valorVenda: 120,
      },
      {
        id: 10,
        nome: "Sérum Facial",
        quantidade: 7,
        preco: 89.9,
        categoria: "Skincare",
        estoqueMinimo: 8,
        custo: 42.5,
        valorVenda: 89.9,
      },
      {
        id: 11,
        nome: "Pó Compacto",
        quantidade: 18,
        preco: 45.9,
        categoria: "Maquiagem",
        estoqueMinimo: 10,
        custo: 21.75,
        valorVenda: 45.9,
      },
      {
        id: 12,
        nome: "Removedor de Esmalte",
        quantidade: 30,
        preco: 9.9,
        categoria: "Unhas",
        estoqueMinimo: 15,
        custo: 3.8,
        valorVenda: 9.9,
      },
      {
        id: 13,
        nome: "Máscara Capilar",
        quantidade: 4,
        preco: 42.9,
        categoria: "Cabelo",
        estoqueMinimo: 8,
        custo: 19.5,
        valorVenda: 42.9,
      },
      {
        id: 14,
        nome: "Sabonete Facial",
        quantidade: 9,
        preco: 29.9,
        categoria: "Skincare",
        estoqueMinimo: 12,
        custo: 13.5,
        valorVenda: 29.9,
      },
      {
        id: 15,
        nome: "Óleo Corporal",
        quantidade: 6,
        preco: 55.9,
        categoria: "Skincare",
        estoqueMinimo: 10,
        custo: 24.8,
        valorVenda: 55.9,
      },
    ]

    localStorage.setItem("produtos", JSON.stringify(produtosExemplo))
    exibirMensagem("Dados de exemplo carregados com sucesso!", "sucesso")
  }
}

function exibirMensagem(texto, tipo) {
  const container = document.getElementById("mensagem-container")

  const div = document.createElement("div")
  div.className = `alert alert-${tipo === "sucesso" ? "success" : "error"}`
  div.textContent = texto

  container.innerHTML = ""
  container.appendChild(div)

  setTimeout(() => {
    div.remove()
  }, 3000)
}
