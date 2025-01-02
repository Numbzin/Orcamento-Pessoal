class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = parseInt(ano);
    this.mes = parseInt(mes);
    this.dia = parseInt(dia);
    this.tipo = parseInt(tipo);
    this.descricao = descricao.trim();
    this.valor = isNaN(parseFloat(valor)) ? 0 : parseFloat(valor);
    this.data = new Date(this.ano, this.mes - 1, this.dia);
  }

  validarDados() {
    const validacoes = {
      ano: () => this.ano >= 2000 && this.ano <= new Date().getFullYear() + 10,
      mes: () => this.mes >= 1 && this.mes <= 12,
      dia: () => {
        const ultimoDia = new Date(this.ano, this.mes, 0).getDate();
        return this.dia >= 1 && this.dia <= ultimoDia;
      },
      tipo: () => [1, 2, 3, 4, 5].includes(this.tipo),
      descricao: () => this.descricao.length >= 3,
      valor: () => this.valor > 0 && !isNaN(this.valor),
    };
    return Object.values(validacoes).every((validacao) => validacao());
  }

  getTipoTexto() {
    const tipos = {
      1: "Alimentação",
      2: "Educação",
      3: "Lazer",
      4: "Saúde",
      5: "Transporte",
    };
    return tipos[this.tipo] || "Outro";
  }

  getValorFormatado() {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.valor);
  }

  getDataFormatada() {
    return new Intl.DateTimeFormat("pt-BR").format(this.data);
  }
}

class Bd {
  constructor() {
    this.storageKey = "despesas";
    this.initialize();
  }

  initialize() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  gravar(despesa) {
    try {
      const despesas = this.recuperarTodosRegistros();
      despesa.id = this.gerarId(despesas);
      despesas.push(despesa);
      localStorage.setItem(this.storageKey, JSON.stringify(despesas));
      return true;
    } catch (error) {
      console.error("Erro ao gravar no localStorage:", error);
      return false;
    }
  }

  gerarId(despesas) {
    return despesas.length > 0 ? Math.max(...despesas.map((d) => d.id)) + 1 : 1;
  }

  recuperarTodosRegistros() {
    try {
      const despesas = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      return despesas
        .map((d) => {
          const despesa = new Despesa(
            d.ano,
            d.mes,
            d.dia,
            d.tipo,
            d.descricao,
            d.valor
          );
          despesa.id = d.id;
          return despesa;
        })
        .sort((a, b) => b.data - a.data);
    } catch (error) {
      console.error("Erro ao recuperar registros:", error);
      return [];
    }
  }

  pesquisar(filtros) {
    let despesas = this.recuperarTodosRegistros();
    Object.entries(filtros).forEach(([campo, valor]) => {
      if (valor) {
        despesas = despesas.filter((despesa) => {
          if (campo === "descricao") {
            return despesa[campo]
              .toLowerCase()
              .includes(valor.trim().toLowerCase());
          }
          return despesa[campo] == valor;
        });
      }
    });
    return despesas;
  }

  remover(id) {
    try {
      let despesas = this.recuperarTodosRegistros();
      despesas = despesas.filter((d) => d.id !== parseInt(id));
      localStorage.setItem(this.storageKey, JSON.stringify(despesas));
      return true;
    } catch (error) {
      console.error("Erro ao remover:", error);
      return false;
    }
  }

  calcularTotal() {
    return this.recuperarTodosRegistros().reduce(
      (total, despesa) => total + despesa.valor,
      0
    );
  }
}

const bd = new Bd();

function mostrarModal(tipo, titulo, mensagem) {
  const modalEl = document.getElementById("modalRegistraDespesa");
  const modal = new bootstrap.Modal(modalEl);

  const headerEl = modalEl.querySelector(".modal-header");
  const titleEl = modalEl.querySelector(".modal-title");
  const bodyEl = modalEl.querySelector(".modal-body");
  const btnEl = modalEl.querySelector(".modal-footer .btn");

  headerEl.className = `modal-header ${
    tipo === "sucesso" ? "bg-success" : "bg-danger"
  }`;
  titleEl.textContent = titulo;
  titleEl.className = "modal-title text-white";
  bodyEl.textContent = mensagem;
  btnEl.className = `btn ${tipo === "sucesso" ? "btn-success" : "btn-danger"}`;

  modal.show();
}

function cadastrarDespesa(event) {
  event.preventDefault();

  const despesa = new Despesa(
    document.getElementById("ano").value,
    document.getElementById("mes").value,
    document.getElementById("dia").value,
    document.getElementById("tipo").value,
    document.getElementById("descricao").value,
    document.getElementById("valor").value
  );

  if (despesa.validarDados()) {
    if (bd.gravar(despesa)) {
      mostrarModal(
        "sucesso",
        "Registro inserido com sucesso",
        "A despesa foi cadastrada com sucesso!"
      );
      limparFormulario();
      carregarListaDespesas();
    } else {
      mostrarModal(
        "erro",
        "Erro na gravação",
        "Houve um erro ao salvar a despesa. Por favor, tente novamente."
      );
    }
  } else {
    mostrarModal(
      "erro",
      "Dados inválidos",
      "Por favor, verifique se todos os campos foram preenchidos corretamente."
    );
  }
}

function limparFormulario() {
  const form = document.querySelector("form");
  if (form) form.reset();
}

function carregarListaDespesas(despesasFiltradas = null) {
  const listaDespesas = document.querySelector(".listaDespesas");
  if (!listaDespesas) return;

  const despesas = despesasFiltradas || bd.recuperarTodosRegistros();

  listaDespesas.innerHTML =
    despesas.length === 0
      ? '<tr><td colspan="5" class="text-center">Nenhuma despesa encontrada</td></tr>'
      : despesas
          .map(
            (despesa) => `
        <tr>
          <td>${despesa.getDataFormatada()}</td>
          <td>${despesa.getTipoTexto()}</td>
          <td>${despesa.descricao}</td>
          <td>${despesa.getValorFormatado()}</td>
          <td>
            <button onclick="mostrarModalConfirmacaoExclusao(${
              despesa.id
            })" class="btn btn-danger btn-sm">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `
          )
          .join("");

  if (despesas.length > 0) {
    const total = bd.calcularTotal();
    listaDespesas.insertAdjacentHTML(
      "beforeend",
      `<tr class="table-info">
        <td colspan="3" class="text-end"><strong>Total:</strong></td>
        <td colspan="2"><strong>${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(total)}</strong></td>
      </tr>`
    );
  }
}

function pesquisarDespesas() {
  const filtros = {
    ano: document.getElementById("ano").value,
    mes: document.getElementById("mes").value,
    dia: document.getElementById("dia").value,
    tipo: document.getElementById("tipo").value,
    descricao: document.getElementById("descricao").value,
    valor: document.getElementById("valor").value,
  };

  const despesasFiltradas = bd.pesquisar(filtros);
  carregarListaDespesas(despesasFiltradas);
}

function mostrarModalConfirmacaoExclusao(id) {
  const modalEl = document.getElementById("modalConfirmacaoExclusao");
  const modal = new bootstrap.Modal(modalEl);
  const confirmButton = modalEl.querySelector(".btn-danger");
  confirmButton.dataset.id = id;
  modal.show();
}

function confirmarRemocao(id) {
  if (bd.remover(id)) {
    const modalEl = document.getElementById("modalConfirmacaoExclusao");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    carregarListaDespesas();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDespesa");
  if (form) {
    form.addEventListener("submit", cadastrarDespesa);
  }

  carregarListaDespesas();
});
