import { carregarDados, salvarDados } from '../utils.js';

class Estatisticas {
    constructor(totalFlashcardsCriados, totalQuizzesRealizados, mediaPontuacao) {
        this.totalFlashcardsCriados = totalFlashcardsCriados || 0;
        this.totalQuizzesRealizados = totalQuizzesRealizados || 0;
        this.mediaPontuacao = mediaPontuacao || 0;
    }

    static async atualizar() {
        const dados = await carregarDados();

        // Calcular as estatísticas
        const totalFlashcards = dados.flashcards.length;
        const totalQuizzes = dados.quizzes.length;
        const mediaPontuacao = totalQuizzes > 0
            ? dados.quizzes.reduce((acc, quiz) => acc + quiz.pontuacao, 0) / totalQuizzes
            : 0;

        // Criar novas estatísticas
        const novasEstatisticas = new Estatisticas(totalFlashcards, totalQuizzes, mediaPontuacao);

        // Atualizar o campo de estatísticas no banco de dados
        dados.estatisticas = novasEstatisticas;
        await salvarDados(dados);

        return novasEstatisticas;
    }

    static async listar() {
        const dados = await carregarDados();
        return dados.estatisticas;
    }
}

export { Estatisticas };
