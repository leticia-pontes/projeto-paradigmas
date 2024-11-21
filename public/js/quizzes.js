import { Quiz } from '../js/classes/Quiz.js';
import { Categoria } from '../js/classes/Categoria.js';
import { Flashcard } from '../js/classes/Flashcard.js';

// Carregar categorias no select
async function carregarCategorias() {
    const categorias = await Categoria.listar();
    const selectCategoria = document.getElementById('categoria-select');
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nome;
        selectCategoria.appendChild(option);
    });
}

// Função para iniciar o quiz com flashcards da categoria selecionada
async function iniciarQuiz() {
    const categoriaId = document.getElementById('categoria-select').value;  // Pega o ID da categoria selecionada
    
    if (!categoriaId || isNaN(categoriaId)) {
        alert('Por favor, selecione uma categoria válida.');
        return;
    }

    // Redirecionar para o quiz.html passando o ID da categoria como parâmetro
    window.location.href = `quiz.html?id=${categoriaId}`;
}

// Função para listar quizzes existentes
async function listarQuizzes() {
    const quizzes = await Quiz.listar();

    const quizzesListDiv = document.getElementById('quizzes-list');
    quizzesListDiv.innerHTML = '';

    if (quizzes.length === 0) {
        quizzesListDiv.innerHTML = '<p>Nenhum quiz encontrado</p>';
        return;
    }

    for (let quiz of quizzes) {
        const categoria = await Categoria.buscar(quiz.categoria);

        // Verifica se a categoria existe
        const categoriaNome = categoria ? categoria.nome : 'Categoria desconhecida';

        // Criar o elemento do quiz
        const cardElement = document.createElement('div');
        cardElement.classList.add('quiz');

        // Inserir o nome da categoria e a data do quiz no card
        cardElement.innerHTML = `
            <h4>Categoria: ${categoriaNome}</h4>
            <p>Pontuação: ${quiz.pontuacao}/${quiz.total_flashcards}</p>
            <small>Data: ${new Date(quiz.data_quiz).toLocaleDateString()} ${new Date(quiz.data_quiz).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })}</small>
        `;

        // Adicionar o card à lista de quizzes
        quizzesListDiv.appendChild(cardElement);
    }
}

// Adicionar evento para o botão "Iniciar Quiz"
document.getElementById('iniciar-quiz-btn').addEventListener('click', iniciarQuiz);

// Carregar categorias ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    listarQuizzes();
});
