document.addEventListener("DOMContentLoaded", () => {
  // Carregar produtos
  carregarProdutos()

  // Configurar busca
  document.getElementById("busca-produto").addEventListener("input", function () {
    carregarProdutos(this.value)
  })

  // Configurar modal de edição
  document.getElementById("btn-cancelar-edicao").addEventListener("click", () => {
    document.getElementById("modal-editar").style.display = "none"
  })

  document.getElementById("btn-salvar-edicao").addEventListener("click", salvarEdicao)

  // Fechar modal ao clicar fora
  document.getElementById("modal-editar").addEventListener("click", function (e) {
    if (e.target === this) {
      this.style.display = "none"
    }
  })
})

function carregarProdutos(termoBusca = "") {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
  const tbody = document.getElementById("produtos-lista")

  // Filtrar produtos se houver termo de busca
  const produtosFiltrados = termoBusca
    ? produtos.filter(
        (p) =>
          p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
          p.categoria.toLowerCase().includes(termoBusca.toLowerCase()),
      )
    : produtos

  // Limpar tabela
  tbody.innerHTML = ""

  if (produtosFiltrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">Nenhum produto encontrado</td>
      </tr>
    `
    return
  }

  // Preencher tabela
  produtosFiltrados.forEach((produto) => {
    const lucro = produto.valorVenda - produto.custo
    const lucroClasse = lucro >= 0 ? "lucro-positivo" : "lucro-negativo"

    const tr = document.createElement("tr")
    tr.className = produto.quantidade <= produto.estoqueMinimo ? "estoque-baixo" : ""

    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>
        <div class="quantidade-controle">
          <button class="btn-quantidade" data-id="${produto.id}" data-action="diminuir">-</button>
          <span class="quantidade-valor">${produto.quantidade}</span>
          <button class="btn-quantidade" data-id="${produto.id}" data-action="aumentar">+</button>
        </div>
      </td>
      <td>R$ ${produto.custo.toFixed(2)}</td>
      <td>R$ ${produto.valorVenda.toFixed(2)}</td>
      <td class="${lucroClasse}">R$ ${lucro.toFixed(2)}</td>
      <td>
        <div class="acoes-container">
          <button class="btn btn-secondary btn-sm" data-id="${produto.id}" data-action="editar">Editar</button>
          <button class="btn btn-danger btn-sm" data-id="${produto.id}" data-action="excluir">Excluir</button>
        </div>
      </td>
    `

    tbody.appendChild(tr)
  })

  // Adicionar event listeners para os botões
  document.querySelectorAll('[data-action="diminuir"]').forEach((btn) => {
    btn.addEventListener("click", () => atualizarQuantidade(btn.dataset.id, -1))
  })

  document.querySelectorAll('[data-action="aumentar"]').forEach((btn) => {
    btn.addEventListener("click", () => atualizarQuantidade(btn.dataset.id, 1))
  })

  document.querySelectorAll('[data-action="editar"]').forEach((btn) => {
    btn.addEventListener("click", () => abrirModalEdicao(btn.dataset.id))
  })

  document.querySelectorAll('[data-action="excluir"]').forEach((btn) => {
    btn.addEventListener("click", () => excluirProduto(btn.dataset.id))
  })
}

function atualizarQuantidade(id, delta) {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
  const index = produtos.findIndex((p) => p.id == id)

  if (index === -1) return

  const novaQuantidade = produtos[index].quantidade + delta

  if (novaQuantidade < 0) {
    exibirMensagem("A quantidade não pode ser negativa", "erro")
    return
  }

  produtos[index].quantidade = novaQuantidade
  localStorage.setItem("produtos", JSON.stringify(produtos))

  carregarProdutos(document.getElementById("busca-produto").value)
  exibirMensagem("Quantidade atualizada com sucesso!", "sucesso")
}

function abrirModalEdicao(id) {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
  const produto = produtos.find((p) => p.id == id)

  if (!produto) return

  document.getElementById("edit-id").value = produto.id
  document.getElementById("edit-nome").value = produto.nome
  document.getElementById("edit-categoria").value = produto.categoria
  document.getElementById("edit-quantidade").value = produto.quantidade
  document.getElementById("edit-estoque-minimo").value = produto.estoqueMinimo
  document.getElementById("edit-custo").value = produto.custo
  document.getElementById("edit-valor-venda").value = produto.valorVenda

  document.getElementById("modal-editar").style.display = "flex"
}

function salvarEdicao() {
  const id = document.getElementById("edit-id").value
  const nome = document.getElementById("edit-nome").value
  const categoria = document.getElementById("edit-categoria").value
  const quantidade = Number.parseInt(document.getElementById("edit-quantidade").value)
  const estoqueMinimo = Number.parseInt(document.getElementById("edit-estoque-minimo").value)
  const custo = Number.parseFloat(document.getElementById("edit-custo").value)
  const valorVenda = Number.parseFloat(document.getElementById("edit-valor-venda").value)

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

  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
  const index = produtos.findIndex((p) => p.id == id)

  if (index === -1) return

  produtos[index] = {
    ...produtos[index],
    nome,
    categoria,
    quantidade,
    estoqueMinimo,
    custo,
    valorVenda,
  }

  localStorage.setItem("produtos", JSON.stringify(produtos))

  document.getElementById("modal-editar").style.display = "none"
  carregarProdutos(document.getElementById("busca-produto").value)
  exibirMensagem("Produto atualizado com sucesso!", "sucesso")
}

function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return

  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
  const index = produtos.findIndex((p) => p.id == id)

  if (index === -1) return

  const nomeProduto = produtos[index].nome
  produtos.splice(index, 1)

  localStorage.setItem("produtos", JSON.stringify(produtos))

  carregarProdutos(document.getElementById("busca-produto").value)
  exibirMensagem(`Produto "${nomeProduto}" excluído com sucesso!`, "sucesso")
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
