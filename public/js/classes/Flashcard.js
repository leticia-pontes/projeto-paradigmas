import { carregarDados, salvarDados } from '../utils.js';

class Flashcard {
    constructor(pergunta, resposta, categoria_id) {
        this.id = Date.now(); // Cria um ID a partir da data e hora de criação
        this.pergunta = pergunta;
        this.resposta = resposta;
        this.categoria_id = categoria_id;
    }

    static async adicionar(pergunta, resposta, categoria_id) {
        const dados = await carregarDados();
        
        // Converte categoria_id para inteiro
        const categoriaIdInt = parseInt(categoria_id, 10);
    
        // Verifica se categoria_id foi convertido corretamente para número
        if (isNaN(categoriaIdInt)) {
            throw new Error('categoria_id não é um número válido');
        }
    
        const novoFlashcard = new Flashcard(pergunta, resposta, categoriaIdInt);
        dados.flashcards.push(novoFlashcard);
        await salvarDados(dados);
        return novoFlashcard;
    }    

    static async listar() {
        const dados = await carregarDados();
        return dados.flashcards;
    }

    static async atualizar(id, pergunta, resposta, categoria_id) {
        const dados = await carregarDados();
        const flashcardIndex = dados.flashcards.findIndex(flashcard => flashcard.id === id);

        if (flashcardIndex !== -1) {
            dados.flashcards[flashcardIndex].pergunta = pergunta;
            dados.flashcards[flashcardIndex].resposta = resposta;
            dados.flashcards[flashcardIndex].categoria_id = categoria_id;
            
            await salvarDados(dados);
            return dados.flashcards[flashcardIndex];
        } else {
            return null;
        }
    }

    static async excluir(id) {
        const dados = await carregarDados();
        const flashcardIndex = dados.flashcards.findIndex(flashcard => flashcard.id === id);

        if (flashcardIndex !== -1) {
            dados.flashcards.splice(flashcardIndex, 1);
            
            await salvarDados(dados);
            return true;
        } else {
            return false;
        }
    }
}

export { Flashcard };
