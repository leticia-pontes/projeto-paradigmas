import { Estatisticas } from '../js/classes/Estatisticas.js';
import { carregarDados, salvarDados } from '../js/utils.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Atualizar as estatísticas
        const estatisticas = await Estatisticas.atualizar();

        // Exibir as estatísticas na página
        document.getElementById("totalFlashcards").textContent = estatisticas.totalFlashcardsCriados;
        document.getElementById("totalQuizzes").textContent = estatisticas.totalQuizzesRealizados;
        document.getElementById("mediaPontuacao").textContent = estatisticas.mediaPontuacao.toFixed(2);

    } catch (error) {
        console.error("Erro ao carregar as estatísticas:", error);
    }
});
