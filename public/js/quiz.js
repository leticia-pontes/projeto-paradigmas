import { Quiz } from '../js/classes/Quiz.js';
import { Flashcard } from '../js/classes/Flashcard.js';
import { carregarDados, salvarDados } from '../js/utils.js';

let flashcardsDaCategoria = [];
let flashcardIndex = 0;
let novoQuiz;  // Definido como variável global

/**
 * Função lógica para verificar se o flashcard pertence a uma categoria específica.
 * Regra: Retorna verdadeiro se o `categoria_id` do flashcard for igual ao fornecido.
 * @param {Object} flashcard - O flashcard a ser verificado.
 * @param {number} categoriaId - O ID da categoria.
 * @returns {boolean} - Verdadeiro se o flashcard pertence à categoria.
 */
function verificarCategoria(flashcard, categoriaId) {
    return flashcard.categoria_id === categoriaId;
}

async function carregarQuiz() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaId = urlParams.get('id'); // ID da categoria da URL

    // Verificar se categoriaId é válido
    if (!categoriaId || isNaN(categoriaId)) {
        alert('Categoria não encontrada.');
        return;
    }

    // Carregar flashcards associados à categoria
    const flashcards = await Flashcard.listar();
    flashcardsDaCategoria = flashcards.filter(flashcard => verificarCategoria(flashcard, parseInt(categoriaId))); // Usando a lógica para verificar a categoria

    if (flashcardsDaCategoria.length === 0) {
        alert('Nenhum flashcard encontrado para esta categoria.');
        return;
    }

    // Inicializar o quiz com pontuação 0
    novoQuiz = await Quiz.iniciar(0, flashcardsDaCategoria.length, parseInt(categoriaId));

    // Exibir o primeiro flashcard
    mostrarFlashcard(flashcardsDaCategoria[flashcardIndex]);
}

function mostrarFlashcard(flashcard) {
    const quizPerguntasDiv = document.getElementById('quiz-perguntas');
    quizPerguntasDiv.innerHTML = '';  // Limpar o conteúdo anterior

    // Exibir a pontuação no topo à direita
    const pontuacaoDiv = document.getElementById('pontuacao');
    pontuacaoDiv.innerHTML = `Pontuação: ${novoQuiz.pontuacao}`; // Acessando a pontuação do objeto novoQuiz

    const flashcardElement = document.createElement('div');
    flashcardElement.classList.add('flashcard');

    flashcardElement.innerHTML = `
        <h4>${flashcard.pergunta}</h4>
        <div id="flashcard-resposta" class="flashcard-resposta" style="display: none;">
            <p>${flashcard.resposta}</p>
        </div>
        <div class="actions">
            <button id="mostrar-resposta-btn" class="action-btn">Mostrar Resposta</button>
        </div>
    `;

    quizPerguntasDiv.appendChild(flashcardElement);

    // Mostrar a resposta ao clicar no botão "Mostrar Resposta"
    document.getElementById('mostrar-resposta-btn').addEventListener('click', () => {
        document.getElementById('flashcard-resposta').style.display = 'block';

        // Substituir "Mostrar Resposta" pelos botões "Acerto" e "Erro"
        mostrarBotoes();
    });
}

function mostrarBotoes() {
    const quizPerguntasDiv = document.getElementById('quiz-perguntas');
    const actionsDiv = quizPerguntasDiv.querySelector('.actions');

    // Remover o botão "Mostrar Resposta"
    const mostrarRespostaBtn = actionsDiv.querySelector('#mostrar-resposta-btn');
    mostrarRespostaBtn.remove();

    // Criar e adicionar os botões "Acerto" e "Erro"
    const acertoBtn = document.createElement('button');
    acertoBtn.textContent = "Acerto";
    acertoBtn.classList.add('action-btn', 'acerto-btn');
    
    const erroBtn = document.createElement('button');
    erroBtn.textContent = "Erro";
    erroBtn.classList.add('action-btn', 'erro-btn');

    actionsDiv.appendChild(acertoBtn);
    actionsDiv.appendChild(erroBtn);

    // Lógica para quando o usuário clica em "Acerto"
    acertoBtn.addEventListener('click', async () => {
        await novoQuiz.incrementarPontuacao();
        proximoFlashcard();
    });

    // Lógica para quando o usuário clica em "Erro"
    erroBtn.addEventListener('click', () => {
        proximoFlashcard();
    });
}

function proximoFlashcard() {
    flashcardIndex++;

    if (flashcardIndex < flashcardsDaCategoria.length) {
        mostrarFlashcard(flashcardsDaCategoria[flashcardIndex]);
    } else {
        alert(`Quiz finalizado! Sua pontuação foi: ${novoQuiz.pontuacao}`); // Exibir a pontuação final do objeto `novoQuiz`
    }
}

// Função para excluir o quiz do banco de dados JSON
async function excluirQuiz() {
    const dados = await carregarDados();

    // Encontrar o quiz pelo ID e removê-lo
    const quizIndex = dados.quizzes.findIndex(quiz => quiz.id === novoQuiz.id);
    if (quizIndex !== -1) {
        dados.quizzes.splice(quizIndex, 1); // Remover o quiz
        await salvarDados(dados);  // Atualizar o arquivo JSON
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarQuiz();
});

// Função para o botão "Finalizar Quiz"
document.getElementById('finalizar-quiz-btn').addEventListener('click', async () => {
    if (flashcardIndex === flashcardsDaCategoria.length) {
        // Se o quiz foi finalizado (todos os flashcards foram respondidos), redireciona para quizzes.html
        window.location.href = 'quizzes.html';
    } else {
        // Se o quiz não foi finalizado, perguntar ao usuário se deseja excluir
        const confirmar = confirm('Você não terminou o quiz. Deseja excluir o quiz e voltar para a página de quizzes?');

        if (confirmar) {
            // Excluir o quiz do banco de dados JSON
            await excluirQuiz();
            // Redirecionar para a página de quizzes
            window.location.href = '../pages/quizzes.html';
        }
    }
});
