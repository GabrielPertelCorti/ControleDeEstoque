import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Configurar tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"))

      this.classList.add("active")
      document.getElementById(`tab-${this.dataset.tab}`).classList.add("active")

      // Recarregar gráficos quando a tab for alterada
      carregarDados()
    })
  })

  // Carregar dados iniciais
  carregarDados()
})

function carregarDados() {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")

  if (produtos.length === 0) {
    document.querySelectorAll(".chart-wrapper").forEach((wrapper) => {
      wrapper.innerHTML = '<div class="empty-chart">Nenhum produto cadastrado</div>'
    })
    return
  }

  // Atualizar estatísticas gerais
  atualizarEstatisticasGerais(produtos)

  // Atualizar gráficos e tabelas
  atualizarGraficoCategorias(produtos)
  atualizarGraficoValorCategorias(produtos)
  atualizarGraficoCategoriasDetalhado(produtos)
  atualizarTabelaCategorias(produtos)
  atualizarEstatisticasFinanceiras(produtos)
  atualizarGraficoMargemLucro(produtos)
  atualizarTabelaProdutosLucrativos(produtos)
  atualizarGraficoEstoque(produtos)
  atualizarTabelaEstoqueBaixo(produtos)
}

function atualizarEstatisticasGerais(produtos) {
  // Total de produtos
  document.getElementById("total-produtos").textContent = produtos.length

  // Total de itens em estoque
  const totalItens = produtos.reduce((total, produto) => total + produto.quantidade, 0)
  document.getElementById("total-itens").textContent = totalItens

  // Valor total do estoque (baseado no valor de venda)
  const valorEstoque = produtos.reduce((total, produto) => {
    return total + produto.valorVenda * produto.quantidade
  }, 0)
  document.getElementById("valor-estoque").textContent = formatarMoeda(valorEstoque)

  // Produtos com estoque baixo
  const estoqueBaixo = produtos.filter((produto) => produto.quantidade <= produto.estoqueMinimo).length
  document.getElementById("estoque-baixo").textContent = estoqueBaixo
}

function atualizarGraficoCategorias(produtos) {
  const canvas = document.getElementById("chart-categorias")

  // Agrupar produtos por categoria
  const categorias = {}
  produtos.forEach((produto) => {
    if (!categorias[produto.categoria]) {
      categorias[produto.categoria] = 0
    }
    categorias[produto.categoria]++
  })

  // Preparar dados para o gráfico
  const labels = Object.keys(categorias)
  const data = Object.values(categorias)
  const cores = gerarCores(labels.length)

  // Destruir gráfico anterior se existir
  const chartInstance = Chart.getChart(canvas)
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Criar novo gráfico
  new Chart(canvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: cores,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  })
}

function atualizarGraficoValorCategorias(produtos) {
  const canvas = document.getElementById("chart-valor-categorias")

  // Agrupar valor total por categoria
  const categorias = {}
  produtos.forEach((produto) => {
    if (!categorias[produto.categoria]) {
      categorias[produto.categoria] = 0
    }
    categorias[produto.categoria] += produto.valorVenda * produto.quantidade
  })

  // Preparar dados para o gráfico
  const labels = Object.keys(categorias)
  const data = Object.values(categorias)
  const cores = gerarCores(labels.length)

  // Destruir gráfico anterior se existir
  const chartInstance = Chart.getChart(canvas)
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Criar novo gráfico
  new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: cores,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw
              return `${context.label}: ${formatarMoeda(value)}`
            },
          },
        },
      },
    },
  })
}

function atualizarGraficoCategoriasDetalhado(produtos) {
  const canvas = document.getElementById("chart-categorias-detalhado")

  // Agrupar produtos por categoria
  const categorias = {}
  produtos.forEach((produto) => {
    if (!categorias[produto.categoria]) {
      categorias[produto.categoria] = {
        quantidade: 0,
        valor: 0,
      }
    }
    categorias[produto.categoria].quantidade += produto.quantidade
    categorias[produto.categoria].valor += produto.valorVenda * produto.quantidade
  })

  // Preparar dados para o gráfico
  const labels = Object.keys(categorias)
  const quantidades = labels.map((cat) => categorias[cat].quantidade)
  const valores = labels.map((cat) => categorias[cat].valor)

  // Destruir gráfico anterior se existir
  const chartInstance = Chart.getChart(canvas)
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Criar novo gráfico
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Quantidade",
          data: quantidades,
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "Valor (R$)",
          data: valores,
          backgroundColor: "rgba(153, 102, 255, 0.7)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "Quantidade",
          },
        },
        y1: {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "Valor (R$)",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  })
}

function atualizarTabelaCategorias(produtos) {
  const tbody = document.getElementById("tabela-categorias")

  // Agrupar produtos por categoria
  const categorias = {}
  produtos.forEach((produto) => {
    if (!categorias[produto.categoria]) {
      categorias[produto.categoria] = {
        produtos: 0,
        quantidade: 0,
        valor: 0,
        lucro: 0,
      }
    }
    categorias[produto.categoria].produtos++
    categorias[produto.categoria].quantidade += produto.quantidade
    categorias[produto.categoria].valor += produto.valorVenda * produto.quantidade
    categorias[produto.categoria].lucro += (produto.valorVenda - produto.custo) * produto.quantidade
  })

  // Limpar tabela
  tbody.innerHTML = ""

  // Preencher tabela
  Object.keys(categorias).forEach((categoria) => {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${categoria}</td>
      <td>${categorias[categoria].produtos}</td>
      <td>${categorias[categoria].quantidade}</td>
      <td>${formatarMoeda(categorias[categoria].valor)}</td>
      <td>${formatarMoeda(categorias[categoria].lucro)}</td>
    `

    tbody.appendChild(tr)
  })
}

function atualizarEstatisticasFinanceiras(produtos) {
  // Valor de custo total
  const valorCusto = produtos.reduce((total, produto) => {
    return total + produto.custo * produto.quantidade
  }, 0)
  document.getElementById("valor-custo").textContent = formatarMoeda(valorCusto)

  // Valor de venda total
  const valorVenda = produtos.reduce((total, produto) => {
    return total + produto.valorVenda * produto.quantidade
  }, 0)
  document.getElementById("valor-venda").textContent = formatarMoeda(valorVenda)

  // Lucro potencial
  const lucroPotencial = valorVenda - valorCusto
  document.getElementById("lucro-potencial").textContent = formatarMoeda(lucroPotencial)

  // Margem média
  const margemMedia = valorVenda > 0 ? (lucroPotencial / valorVenda) * 100 : 0
  document.getElementById("margem-media").textContent = `${margemMedia.toFixed(1)}%`
}

function atualizarGraficoMargemLucro(produtos) {
  const canvas = document.getElementById("chart-margem-lucro")

  // Calcular margem de lucro por categoria
  const categorias = {}
  produtos.forEach((produto) => {
    if (!categorias[produto.categoria]) {
      categorias[produto.categoria] = {
        valorVenda: 0,
        valorCusto: 0,
      }
    }
    categorias[produto.categoria].valorVenda += produto.valorVenda * produto.quantidade
    categorias[produto.categoria].valorCusto += produto.custo * produto.quantidade
  })

  // Calcular margem de lucro
  const labels = Object.keys(categorias)
  const margens = labels.map((cat) => {
    const venda = categorias[cat].valorVenda
    const custo = categorias[cat].valorCusto
    return venda > 0 ? ((venda - custo) / venda) * 100 : 0
  })

  // Destruir gráfico anterior se existir
  const chartInstance = Chart.getChart(canvas)
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Criar novo gráfico
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Margem de Lucro (%)",
          data: margens,
          backgroundColor: margens.map((m) => (m >= 0 ? "rgba(16, 185, 129, 0.7)" : "rgba(239, 68, 68, 0.7)")),
          borderColor: margens.map((m) => (m >= 0 ? "rgba(16, 185, 129, 1)" : "rgba(239, 68, 68, 1)")),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Margem de Lucro (%)",
          },
        },
      },
    },
  })
}

function atualizarTabelaProdutosLucrativos(produtos) {
  const tbody = document.getElementById("tabela-lucrativos")

  // Calcular margem de lucro para cada produto
  const produtosComMargem = produtos.map((produto) => {
    const margemLucro = produto.valorVenda > 0 ? ((produto.valorVenda - produto.custo) / produto.valorVenda) * 100 : 0
    return {
      ...produto,
      margemLucro,
      lucroPorUnidade: produto.valorVenda - produto.custo,
    }
  })

  // Ordenar por margem de lucro (decrescente)
  produtosComMargem.sort((a, b) => b.margemLucro - a.margemLucro)

  // Limpar tabela
  tbody.innerHTML = ""

  // Preencher tabela
  produtosComMargem.slice(0, 10).forEach((produto) => {
    const tr = document.createElement("tr")

    const margemClasse = produto.margemLucro >= 0 ? "text-success" : "text-error"
    const lucroClasse = produto.lucroPorUnidade >= 0 ? "text-success" : "text-error"

    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>R$ ${produto.custo.toFixed(2)}</td>
      <td>R$ ${produto.valorVenda.toFixed(2)}</td>
      <td class="${margemClasse}">${produto.margemLucro.toFixed(1)}%</td>
      <td class="${lucroClasse}">R$ ${produto.lucroPorUnidade.toFixed(2)}</td>
    `

    tbody.appendChild(tr)
  })
}

function atualizarGraficoEstoque(produtos) {
  const canvas = document.getElementById("chart-estoque")

  // Agrupar produtos por categoria para o estoque
  const categorias = {}
  produtos.forEach((produto) => {
    if (!categorias[produto.categoria]) {
      categorias[produto.categoria] = 0
    }
    categorias[produto.categoria] += produto.quantidade
  })

  // Preparar dados para o gráfico
  const labels = Object.keys(categorias)
  const data = Object.values(categorias)

  // Destruir gráfico anterior se existir
  const chartInstance = Chart.getChart(canvas)
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Criar novo gráfico
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Quantidade em Estoque",
          data: data,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Quantidade",
          },
        },
      },
    },
  })
}

function atualizarTabelaEstoqueBaixo(produtos) {
  const tbody = document.getElementById("tabela-estoque-baixo")

  // Filtrar produtos com estoque baixo
  const produtosBaixo = produtos.filter((produto) => produto.quantidade <= produto.estoqueMinimo)

  // Ordenar por quantidade (crescente)
  produtosBaixo.sort((a, b) => a.quantidade - b.quantidade)

  // Limpar tabela
  tbody.innerHTML = ""

  if (produtosBaixo.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">Nenhum produto com estoque baixo</td>
      </tr>
    `
    return
  }

  // Preencher tabela
  produtosBaixo.forEach((produto) => {
    const tr = document.createElement("tr")

    const status = produto.quantidade === 0 ? "Esgotado" : "Baixo"
    const badgeClass = produto.quantidade === 0 ? "badge-error" : "badge-warning"

    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.quantidade}</td>
      <td>${produto.estoqueMinimo}</td>
      <td><span class="badge ${badgeClass}">${status}</span></td>
    `

    tbody.appendChild(tr)
  })
}

function gerarCores(quantidade) {
  const cores = [
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)",
    "rgba(199, 199, 199, 0.7)",
    "rgba(83, 102, 255, 0.7)",
    "rgba(78, 205, 196, 0.7)",
    "rgba(255, 99, 71, 0.7)",
  ]

  // Se precisar de mais cores do que as predefinidas, gerar aleatoriamente
  if (quantidade > cores.length) {
    for (let i = cores.length; i < quantidade; i++) {
      const r = Math.floor(Math.random() * 255)
      const g = Math.floor(Math.random() * 255)
      const b = Math.floor(Math.random() * 255)
      cores.push(`rgba(${r}, ${g}, ${b}, 0.7)`)
    }
  }

  return cores.slice(0, quantidade)
}

function formatarMoeda(valor) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`
}
