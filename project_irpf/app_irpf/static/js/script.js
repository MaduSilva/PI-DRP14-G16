// Função para abrir e fechar o modal
document.addEventListener('click', function(event) {
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
    modal.classList.add('active');
  }

  // Função para remover o último item da lista
function removerItem() {
    const list = document.querySelector('.list');
    const items = list.querySelectorAll('.list-item');
  
    // Verifica se há itens na lista para remover
    if (items.length > 0) {
      // Remove o último item da lista
      list.removeChild(items[items.length - 1]);
    }
  }

  // Adiciona um ouvinte de evento ao botão 'Remover'
document.getElementById('removeBtn').addEventListener('click', removerItem);

  
  
  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
  }
  
  // Função para adicionar um novo cliente à lista
  document.getElementById('addClientForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
  
    const list = document.querySelector('.list');
  
    // Cria um novo item da lista
    const newItem = document.createElement('div');
    newItem.classList.add('list-item');
    newItem.innerHTML = `
      <div class="user-info">${nome}</div>

    `;
  
    // Adiciona o novo item à lista
    list.appendChild(newItem);
  
    // Fecha o modal após adicionar o cliente
    const modal = document.getElementById('addModal');
    closeModal(modal);
  });
  

  // Função para formatar CPF
function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

  // Aplica a máscara de CPF
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  return cpf;
}

// Evento para formatar CPF enquanto o usuário digita
document.getElementById('cpf').addEventListener('input', function() {
  var cpf = this.value;
  this.value = formatarCPF(cpf);
});
