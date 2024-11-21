import { Flashcard } from '../js/classes/Flashcard.js';
import { Categoria } from '../js/classes/Categoria.js';

// Função para mostrar o formulário de criação do flashcard
function mostrarFormulario(categorias) {
    let categoriaSelecionada = null;

    const formDiv = document.createElement('div');
    formDiv.innerHTML = `
        <h3>Criar Flashcard</h3>
        <label for="pergunta">Pergunta: </label>
        <input type="text" id="pergunta" required><br>

        <label for="resposta">Resposta: </label>
        <input type="text" id="resposta" required><br>

        <label for="categoria">Categoria: </label>
        <select id="categoria-select" required>
            <option value="">Selecione uma categoria</option>
        </select>
    `;

    const selectCategoria = formDiv.querySelector('#categoria-select');
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nome;
        selectCategoria.appendChild(option);
    });

    const button = document.getElementById('criar-flashcard-btn');
    button.insertAdjacentElement('afterend', formDiv);

    const confirmarButton = document.createElement('button');
    confirmarButton.textContent = 'Criar Flashcard';
    confirmarButton.onclick = async () => {
        const pergunta = formDiv.querySelector('#pergunta').value;
        const resposta = formDiv.querySelector('#resposta').value;
        categoriaSelecionada = selectCategoria.value;

        if (!pergunta || !resposta || !categoriaSelecionada) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        // Criar o flashcard
        try {
            await Flashcard.adicionar(pergunta, resposta, categoriaSelecionada);
            alert('Flashcard criado com sucesso!');
            location.reload(true);
            // listarFlashcards(); // Recarregar a lista de flashcards
        } catch (error) {
            alert('Erro ao criar flashcard: ' + error.message);
        }
    };

    formDiv.appendChild(confirmarButton);
}

// Função para adicionar o flashcard
async function adicionarFlashcard() {
    const categorias = await Categoria.listar();

    // Mostrar o formulário
    mostrarFormulario(categorias);
}

// Função para listar os flashcards
async function listarFlashcards() {
    const flashcards = await Flashcard.listar();
    const categorias = await Categoria.listar();

    const flashcardListDiv = document.getElementById('flashcard-list');
    flashcardListDiv.innerHTML = '';

    if (flashcards.length === 0) {
        flashcardListDiv.innerHTML = '<p>Nenhum flashcard encontrado</p>';
        return;
    }

    flashcards.forEach(flashcard => {
        // Encontre a categoria com base no categoria_id do flashcard
        const categoria = categorias.find(c => c.id === flashcard.categoria_id);

        // Se a categoria for encontrada, use seu nome, caso contrário use "Categoria Desconhecida"
        const categoriaNome = categoria ? categoria.nome : "Categoria Desconhecida";

        const cardElement = document.createElement('div');
        cardElement.classList.add('flashcard');

        cardElement.innerHTML = `
            <h4>${flashcard.pergunta}</h4>
            <p>${flashcard.resposta}</p>
            <small>Categoria: ${categoriaNome}</small>
            <div class="actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

        // Adicionar listeners de edição e exclusão
        const editButton = cardElement.querySelector('.edit-btn');
        editButton.addEventListener('click', () => editarFlashcard(flashcard.id));

        const deleteButton = cardElement.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => excluirFlashcard(flashcard.id));

        flashcardListDiv.appendChild(cardElement);
    });
}

// Função para editar o flashcard
async function editarFlashcard(id) {
    const flashcards = await Flashcard.listar();
    const card = flashcards.find(f => f.id === id);

    if (card) {
        const novaPergunta = prompt('Editar Pergunta:', card.pergunta);
        const novaResposta = prompt('Editar Resposta:', card.resposta);
        const novaCategoria = prompt('Editar Categoria:', card.categoria_id);

        if (novaPergunta && novaResposta && novaCategoria) {
            const categoriaId = parseInt(novaCategoria);
            await Flashcard.atualizar(id, novaPergunta, novaResposta, categoriaId);
            listarFlashcards();
        }
    }
}

// Função para excluir o flashcard
async function excluirFlashcard(id) {
    const confirmDelete = confirm('Tem certeza que deseja excluir este flashcard?');
    if (confirmDelete) {
        const sucesso = await Flashcard.excluir(id);
        if (sucesso) {
            alert('Flashcard excluído com sucesso!');
            listarFlashcards();
        } else {
            alert('Erro ao excluir o flashcard.');
        }
    }
}

// Evento que carrega a lista de flashcards quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    listarFlashcards();
    const button = document.getElementById('criar-flashcard-btn');
    button.addEventListener('click', adicionarFlashcard);
});
