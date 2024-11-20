import { carregarDados, salvarDados } from '../utils.js';

class Quiz {
    constructor(flashcards, pontuacao, dataQuiz) {
        this.id = Date.now();
        this.flashcards = flashcards;
        this.pontuacao = pontuacao || 0;
        this.dataQuiz = dataQuiz || new Date().toISOString();
    }

    static async iniciar(flashcards) {
        const dados = await carregarDados();
        const novoQuiz = new Quiz(flashcards, 0, new Date().toISOString());
        dados.quizzes.push(novoQuiz);
        await salvarDados(dados);
        return novoQuiz;
    }

    static async listar() {
        const dados = await carregarDados();
        return dados.quizzes;
    }
}

export { Quiz };
