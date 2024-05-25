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
      item.addEventListener("click", removeItem);
    });
  } else {
    statusMessage.textContent = "";
    document.querySelectorAll(".list-item").forEach((item) => {
      item.classList.remove("deletable");
      item.removeEventListener("click", removeItem);
    });
  }
}

function removeItem(event) {
  if (isDeleteMode) {
    const item = event.target.closest(".list-item");
    if (item) {
      const customerId = item.dataset.customerId;
      if (!customerId) {
        console.error("Customer ID is undefined");
        return;
      }
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
          let documentsHtml = "";

          data.documents.forEach((doc) => {
            let docHtml = "";

            if (doc.document_type === "pdf") {
              docHtml = `
              <p>${doc.name}</p> <iframe src="data:application/pdf;base64,${doc.data}" class="document-iframe"></iframe>`;
            } else if (doc.document_type === "docx") {
              docHtml = ` <p>${doc.name}</p> <a class="btn-download" href="data:application/octet-stream;base64,${doc.data}" download="${doc.name}.${doc.document_type}">
              <i class="fa fa-download"></i> Baixar
            </a>
                `;
            } else if (
              doc.document_type === "jpg" ||
              doc.document_type === "png"
            ) {
              docHtml = `
              <p>${doc.name}</p>
              <a class="btn-download" href="data:image/png;base64,${doc.data}" download="${doc.name}.${doc.document_type}">
                <i class="fa fa-download"></i> Baixar
              </a>
              <img src="data:image/png;base64,${doc.data}" alt="${doc.name}" class="document-image">
                `;
            } else {
              docHtml = `<p>${doc.name}</p>`;
            }

            documentsHtml += `<li>${docHtml}</li>`;
          });

          customerDetails.innerHTML = `
            <div class="customer-info">
              <h2 id="customer-name">${data.name}</h2>
              <div class="info-group">
                <p><strong>CPF:</strong> <input type="text" id="customer-cpf" value="${
                  data.cpf
                }" readonly></p>
                <p><strong>Data de Nascimento:</strong> <input type="date" id="customer-birthDate" value="${
                  data.birthDate
                }" readonly></p>
              </div>
              <div class="info-group">
                <p><strong>Email:</strong> <input type="email" id="customer-email" value="${
                  data.email
                }" readonly></p>
                <p><strong>Telefone:</strong> <input type="tel" id="customer-phone" value="${
                  data.phone
                }" readonly></p>
              </div>
              <div class="info-group">
                <p><strong>Status:</strong> 
                  <select id="customer-status" disabled>
                    <option value="Pendente" ${
                      data.status === "Pendente" ? "selected" : ""
                    }>Pendente</option>
                    <option value="Enviada" ${
                      data.status === "Enviada" ? "selected" : ""
                    }>Enviada</option>
                    <option value="Analisando" ${
                      data.status === "Analisando" ? "selected" : ""
                    }>Analisando</option>
                    <option value="Concluido" ${
                      data.status === "Concluido" ? "selected" : ""
                    }>Concluído</option>
                  </select>
                </p>
              </div>
            </div>
            <div class="documents">
              <h3>Documentos:</h3>
              <ul id="document-list">
                ${documentsHtml}
              </ul>
            </div>
          `;

          openModal(modal);
          initializeEditButtons(customerId);
        })
        .catch((error) =>
          console.error("Erro ao buscar informações do cliente:", error)
        );
    });
  });
});

let documentCount = 1;

document
  .getElementById("addDocumentBtn")
  .addEventListener("click", function () {
    documentCount++;
    const documentGroup = document.createElement("div");
    documentGroup.classList.add("document-group");

    documentGroup.innerHTML = `
    <div class="form-group">
      <label for="document_name_${documentCount}">Nome do Documento:</label>
      <input type="text" id="document_name_${documentCount}" name="document_name[]" required />
    </div>
    <div class="form-group">
      <label for="document_file_${documentCount}">Documento:</label>
      <input type="file" id="document_file_${documentCount}" name="documents[]" required />
    </div>
  `;

    document
      .getElementById("addClientForm")
      .insertBefore(documentGroup, document.getElementById("addDocumentBtn"));
  });

function initializeEditButtons(customerId) {
  const editButton = document.getElementById("edit-customer");
  const saveButton = document.getElementById("save-customer");
  const cancelButton = document.getElementById("cancel-edit");
  const inputFields = document.querySelectorAll(
    "#customer-details input, #customer-details select"
  );

  editButton.addEventListener("click", function () {
    inputFields.forEach(function (input) {
      input.removeAttribute("readonly");
      input.removeAttribute("disabled");
    });
    editButton.style.display = "none";
    saveButton.style.display = "inline-block";
    cancelButton.style.display = "inline-block";
  });

  cancelButton.addEventListener("click", function () {
    inputFields.forEach(function (input) {
      input.setAttribute("readonly", "readonly");
      input.setAttribute("disabled", "disabled");
    });
    editButton.style.display = "inline-block";
    saveButton.style.display = "none";
    cancelButton.style.display = "none";
  });

  saveButton.addEventListener("click", function () {
    const csrfToken = document.querySelector(
      "[name=csrfmiddlewaretoken]"
    ).value;

    const updatedData = {
      id: customerId,
      name: document.getElementById("customer-name").innerText,
      cpf: document.getElementById("customer-cpf").value,
      birthDate: document.getElementById("customer-birthDate").value,
      email: document.getElementById("customer-email").value,
      phone: document.getElementById("customer-phone").value,
      status: document.getElementById("customer-status").value,
    };

    fetch(`/customer/${customerId}/edit/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          inputFields.forEach(function (input) {
            input.setAttribute("readonly", "readonly");
            input.setAttribute("disabled", "disabled");
          });
          editButton.style.display = "inline-block";
          saveButton.style.display = "none";
          cancelButton.style.display = "none";
          window.location.href = "/";
        } else {
          console.error("Error on save data", data.message);
        }
      })
      .catch((error) => console.error("Erro:", error));
  });
}
