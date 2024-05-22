document.addEventListener("click", function (event) {
  if (event.target.dataset.modalTarget) {
    const modal = document.querySelector(event.target.dataset.modalTarget);
    openModal(modal);
  }

  if (event.target.dataset.modalClose) {
    const modal = document.querySelector(event.target.dataset.modalClose);
    closeModal(modal);
  }
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
}

let isDeleteMode = false;

function toggleDeleteMode() {
  isDeleteMode = !isDeleteMode;
  const statusMessage = document.getElementById("statusMessage");

  if (isDeleteMode) {
    statusMessage.textContent =
      "Selecione os itens que deseja excluir e clique no botão 'remover' novamente quando encerrar.";
    document.querySelectorAll(".list-item").forEach((item) => {
      item.classList.add("deletable");
    });
  } else {
    statusMessage.textContent = "";
    document.querySelectorAll(".list-item").forEach((item) => {
      item.classList.remove("deletable");
    });
  }
}

function removeItem(event) {
  if (isDeleteMode) {
    const item = event.target.closest(".list-item");
    if (item) {
      const customerId = item.dataset.customerId;
      fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
            .value,
        },
        body: new URLSearchParams({
          delete: true,
          customer_id: customerId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            item.remove();
          } else {
            console.error("Failed to delete customer:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
}

function addRemoveListener(item) {
  item.addEventListener("click", removeItem);
}

document
  .getElementById("removeBtn")
  .addEventListener("click", toggleDeleteMode);

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
}

function addInitialRemoveListeners() {
  const items = document.querySelectorAll(".list-item");
  items.forEach(addRemoveListener);
}

document.addEventListener("DOMContentLoaded", addInitialRemoveListeners);

document
  .getElementById("addClientForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch(window.location.href, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
          .value,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          const list = document.querySelector(".list");
          const newItem = document.createElement("div");
          newItem.classList.add("list-item");
          newItem.innerHTML = `
              <div class="user-info-name">${data.name}</div>
              <div class="user-info-cpf">${data.cpf}</div>
              <div class="user-info-birthDate">${data.birthDate}</div>
              <div class="user-info-email">${data.email}</div>
              <div class="user-info-phone">${data.phone}</div>
              <div class="user-info-documents">${data.documents}</div>
              <div class="user-info-status">${data.status}</div>
          `;
          list.appendChild(newItem);

          document.getElementById("addClientForm").reset();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const modal = document.getElementById("addModal");
    closeModal(modal);
  });

function formatCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return cpf;
}

document.getElementById("cpf").addEventListener("input", function () {
  var cpf = this.value;
  this.value = formatCPF(cpf);
});

document.addEventListener("DOMContentLoaded", function () {
  const customerNameElements = document.querySelectorAll(".user-info-name");

  customerNameElements.forEach(function (element) {
    element.addEventListener("click", function () {
      const customerId = this.dataset.customerId;
      const modal = document.getElementById("customer-modal");

      fetch(`/customer/${customerId}/details/`)
        .then((response) => response.json())
        .then((data) => {
          const customerDetails = document.getElementById("customer-details");
          customerDetails.innerHTML = `
                      <p>Nome: ${data.name}</p>
                      <p>CPF: ${data.cpf}</p>
                      <p>Data de Nascimento: ${data.birthDate}</p>
                      <p>Email: ${data.email}</p>
                      <p>Telefone: ${data.phone}</p>
                      <p>Documentos: ${data.documents}</p>
                      <p>Status: ${data.status}</p>
                  `;

          
          openModal(modal);
        })
        .catch((error) =>
          console.error("Erro ao buscar informações do cliente:", error)
        );
    });
  });
});

document.addEventListener("click", function (event) {
  if (event.target.dataset.modalClose) {
    const modal = document.querySelector(event.target.dataset.modalClose);
    closeModal(modal);
  }
});
