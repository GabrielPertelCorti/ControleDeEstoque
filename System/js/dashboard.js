document.addEventListener("DOMContentLoaded", () => {
  // Carregar produtos do localStorage
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")

  // Atualizar estatísticas
  atualizarEstatisticas(produtos)

  // Atualizar listas
  atualizarProdutosLucrativos(produtos)
  atualizarProdutosCriticos(produtos)
})

function atualizarEstatisticas(produtos) {
  // Total de produtos
  document.getElementById("total-produtos").textContent = produtos.length

  // Valor total do estoque (baseado no valor de venda)
  const valorEstoque = produtos.reduce((total, produto) => {
    return total + produto.valorVenda * produto.quantidade
  }, 0)
  document.getElementById("valor-estoque").textContent = formatarMoeda(valorEstoque)

  // Lucro potencial (valor de venda - custo)
  const lucroPotencial = produtos.reduce((total, produto) => {
    return total + (produto.valorVenda - produto.custo) * produto.quantidade
  }, 0)
  document.getElementById("lucro-potencial").textContent = formatarMoeda(lucroPotencial)

  // Produtos com estoque baixo
  const estoqueBaixo = produtos.filter((produto) => produto.quantidade <= produto.estoqueMinimo).length
  document.getElementById("estoque-baixo").textContent = estoqueBaixo
}

function atualizarProdutosLucrativos(produtos) {
  const listaProdutos = document.getElementById("produtos-lucrativos")

  // Limpar lista
  listaProdutos.innerHTML = ""

  if (produtos.length === 0) {
    listaProdutos.innerHTML = '<li class="product-list-item empty-list">Nenhum produto cadastrado</li>'
    return
  }

  // Calcular margem de lucro para cada produto
  const produtosComMargem = produtos.map((produto) => {
    const margemLucro = produto.valorVenda > 0 ? ((produto.valorVenda - produto.custo) / produto.valorVenda) * 100 : 0
    return {
      ...produto,
      margemLucro,
    }
  })

  // Ordenar por margem de lucro (decrescente)
  produtosComMargem.sort((a, b) => b.margemLucro - a.margemLucro)

  // Exibir os 5 mais lucrativos
  const topProdutos = produtosComMargem.slice(0, 5)

  topProdutos.forEach((produto) => {
    const li = document.createElement("li")
    li.className = "product-list-item"

    const produtoInfo = document.createElement("div")
    produtoInfo.className = "product-info"

    const produtoNome = document.createElement("span")
    produtoNome.className = "product-name"
    produtoNome.textContent = produto.nome

    const produtoCategoria = document.createElement("span")
    produtoCategoria.className = "product-category"
    produtoCategoria.textContent = produto.categoria

    produtoInfo.appendChild(produtoNome)
    produtoInfo.appendChild(produtoCategoria)

    const produtoStats = document.createElement("div")
    produtoStats.className = "product-stats"

    const produtoValor = document.createElement("div")
    produtoValor.className = "product-value"
    produtoValor.textContent = formatarMoeda(produto.valorVenda - produto.custo)

    const produtoPercent = document.createElement("div")
    produtoPercent.className = "product-percent"
    produtoPercent.textContent = `${produto.margemLucro.toFixed(1)}% de margem`

    produtoStats.appendChild(produtoValor)
    produtoStats.appendChild(produtoPercent)

    li.appendChild(produtoInfo)
    li.appendChild(produtoStats)

    listaProdutos.appendChild(li)
  })
}

function atualizarProdutosCriticos(produtos) {
  const listaProdutos = document.getElementById("produtos-criticos")

  // Limpar lista
  listaProdutos.innerHTML = ""

  // Filtrar produtos com estoque baixo
  const produtosCriticos = produtos.filter((produto) => produto.quantidade <= produto.estoqueMinimo)

  if (produtosCriticos.length === 0) {
    listaProdutos.innerHTML = '<li class="product-list-item empty-list">Nenhum produto com estoque crítico</li>'
    return
  }

  // Ordenar por quantidade (crescente)
  produtosCriticos.sort((a, b) => a.quantidade - b.quantidade)

  // Exibir produtos críticos
  produtosCriticos.forEach((produto) => {
    const li = document.createElement("li")
    li.className = "product-list-item"

    const produtoInfo = document.createElement("div")
    produtoInfo.className = "product-info"

    const produtoNome = document.createElement("span")
    produtoNome.className = "product-name"
    produtoNome.textContent = produto.nome

    const produtoCategoria = document.createElement("span")
    produtoCategoria.className = "product-category"
    produtoCategoria.textContent = produto.categoria

    produtoInfo.appendChild(produtoNome)
    produtoInfo.appendChild(produtoCategoria)

    const produtoStats = document.createElement("div")
    produtoStats.className = "product-stats"

    const produtoEstoque = document.createElement("div")
    produtoEstoque.className = "product-value text-error"
    produtoEstoque.textContent = `${produto.quantidade} / ${produto.estoqueMinimo}`

    produtoStats.appendChild(produtoEstoque)

    li.appendChild(produtoInfo)
    li.appendChild(produtoStats)

    listaProdutos.appendChild(li)
  })
}

function formatarMoeda(valor) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`
}
