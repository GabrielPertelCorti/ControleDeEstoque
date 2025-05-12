document.addEventListener("DOMContentLoaded", () => {
  // Configurar formulário
  document.getElementById("form-produto").addEventListener("submit", cadastrarProduto)
  document.getElementById("btn-limpar").addEventListener("click", limparFormulario)

  // Calcular margem de lucro ao digitar valores
  document.getElementById("custo").addEventListener("input", calcularMargemLucro)
  document.getElementById("valor-venda").addEventListener("input", calcularMargemLucro)

  // Carregar configurações
  carregarConfiguracoes()
})

function calcularMargemLucro() {
  const custo = Number.parseFloat(document.getElementById("custo").value) || 0
  const valorVenda = Number.parseFloat(document.getElementById("valor-venda").value) || 0

  if (custo > 0 && valorVenda > 0) {
    const margemLucro = ((valorVenda - custo) / valorVenda) * 100
    const margemLucroElement = document.getElementById("margem-lucro-valor")

    margemLucroElement.textContent = `${margemLucro.toFixed(1)}%`
    margemLucroElement.className =
      "margem-lucro-valor " + (margemLucro >= 0 ? "margem-lucro-positiva" : "margem-lucro-negativa")

    document.getElementById("margem-lucro").style.display = "flex"
  } else {
    document.getElementById("margem-lucro").style.display = "none"
  }
}

function carregarConfiguracoes() {
  const configuracoes = JSON.parse(localStorage.getItem("configuracoes") || "{}")

  if (configuracoes.estoqueMinimoPadrao) {
    document.getElementById("estoque-minimo").value = configuracoes.estoqueMinimoPadrao
  }
}

function cadastrarProduto(e) {
  e.preventDefault()

  const nome = document.getElementById("nome").value
  const categoria = document.getElementById("categoria").value
  const quantidade = Number.parseInt(document.getElementById("quantidade").value)
  const estoqueMinimo = Number.parseInt(document.getElementById("estoque-minimo").value)
  const custo = Number.parseFloat(document.getElementById("custo").value)
  const valorVenda = Number.parseFloat(document.getElementById("valor-venda").value)

  if (
    !nome ||
    isNaN(quantidade) ||
    quantidade < 0 ||
    isNaN(estoqueMinimo) ||
    estoqueMinimo < 0 ||
    isNaN(custo) ||
    custo < 0 ||
    isNaN(valorVenda) ||
    valorVenda < 0
  ) {
    exibirMensagem("Por favor, preencha todos os campos corretamente", "erro")
    return
  }

  // Carregar produtos existentes
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")

  // Gerar novo ID
  const newId = produtos.length > 0 ? Math.max(...produtos.map((p) => p.id)) + 1 : 1

  // Criar novo produto
  const novoProduto = {
    id: newId,
    nome,
    categoria,
    quantidade,
    estoqueMinimo,
    custo,
    valorVenda,
  }

  // Adicionar à lista
  produtos.push(novoProduto)

  // Salvar no localStorage
  localStorage.setItem("produtos", JSON.stringify(produtos))

  // Exibir mensagem de sucesso
  exibirMensagem(`Produto "${nome}" cadastrado com sucesso!`, "sucesso")

  // Limpar formulário
  limparFormulario()
}

function limparFormulario() {
  document.getElementById("nome").value = ""
  document.getElementById("categoria").value = "Maquiagem"
  document.getElementById("quantidade").value = "0"

  // Recarregar estoque mínimo padrão das configurações
  const configuracoes = JSON.parse(localStorage.getItem("configuracoes") || "{}")
  document.getElementById("estoque-minimo").value = configuracoes.estoqueMinimoPadrao || "10"

  document.getElementById("custo").value = ""
  document.getElementById("valor-venda").value = ""
  document.getElementById("margem-lucro").style.display = "none"

  // Focar no primeiro campo
  document.getElementById("nome").focus()
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
