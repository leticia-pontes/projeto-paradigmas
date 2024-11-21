import { carregarDados, salvarDados } from '../utils.js';

class Quiz {
    constructor(pontuacao, total_flashcards, categoria, data_quiz) {
        this.id = Date.now();  // Gerar um ID único para o quiz
        this.pontuacao = pontuacao || 0;
        this.total_flashcards = total_flashcards || 0;
        this.categoria = categoria;
        this.data_quiz = data_quiz || new Date().toISOString();
    }

    static async iniciar(pontuacao, total_flashcards, categoria) {
        const dados = await carregarDados();
        const novoQuiz = new Quiz(pontuacao, total_flashcards, categoria);
        dados.quizzes.push(novoQuiz);  // Adicionar quiz aos dados
        await salvarDados(dados);  // Persistir os dados no arquivo
        return novoQuiz;
    }

    static async listar() {
        const dados = await carregarDados();
        return dados.quizzes;
    }

    // Método para incrementar a pontuação e salvar as alterações no arquivo JSON
    async incrementarPontuacao() {
        this.pontuacao++;
        
        // Carregar os dados para encontrar o quiz e atualizar sua pontuação
        const dados = await carregarDados();
        const quizIndex = dados.quizzes.findIndex(quiz => quiz.id === this.id);
        
        if (quizIndex !== -1) {
            // Atualizar a pontuação no objeto correspondente
            dados.quizzes[quizIndex].pontuacao = this.pontuacao;

            // Salvar os dados atualizados no arquivo
            await salvarDados(dados);
        }
    }
}

export { Quiz };
