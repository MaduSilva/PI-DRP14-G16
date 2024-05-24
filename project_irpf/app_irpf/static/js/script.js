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
    const item = event.target.closest(".list-item .user-info-name");
    if (item) {
      console.log(item);
      const customerId = item.dataset.customerId;
      console.log(customerId);
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
              docHtml = `<iframe src="data:application/pdf;base64,${doc.data}" class="document-iframe"></iframe>`;
            } else if (doc.document_type === "docx") {
              docHtml = `
                    <p>${doc.name}</p>
                    <a href="data:application/octet-stream;base64,${doc.data}" download="${doc.name}.docx">Baixar ${doc.name}</a>
                `;
            } else if (
              doc.document_type === "jpg" ||
              doc.document_type === "png"
            ) {
              docHtml = `
                    <p>${doc.name}</p>
                    <img src="data:image/png;base64,${doc.data}" alt="${doc.name}" class="document-image">
                `;
            } else {
              docHtml = `<p>${doc.name}</p>`;
            }

            documentsHtml += `<li>${docHtml}</li>`;
          });

          customerDetails.innerHTML = `
            <div class="customer-info">
              <h2>${data.name}</h2>
              <div class="info-group">
                <p><strong>CPF:</strong> ${data.cpf}</p>
                <p><strong>Data de Nascimento:</strong> ${data.birthDate}</p>
              </div>
              <div class="info-group">
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Telefone:</strong> ${data.phone}</p>
              </div>
              <div class="info-group">
                <p><strong>Status:</strong> ${data.status}</p>
              </div>
            </div>
            <div class="documents">
              <h3>Documentos:</h3>
              <ul>${documentsHtml}</ul>
            </div>
          `;

          openModal(modal);
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
