# Paradigmas de Linguagem de Programação

### **Descrição do Projeto**  
Este projeto implementa um sistema interativo de **flashcards** e **quizzes**, utilizando diferentes paradigmas de programação para explorar técnicas variadas de modelagem e implementação. O sistema oferece funcionalidades como:  

- Gerenciamento de flashcards e categorias.  
- Realização de quizzes baseados em categorias.  
- Exibição de estatísticas detalhadas.  

---

### **Paradigmas e Implementações**

#### **Paradigma Orientado a Objetos**  
**Arquivo**: `Flashcard.js`  

Os flashcards são modelados como objetos com propriedades e métodos. Um exemplo é o método `adicionar`, que cria e armazena um novo flashcard:  
```javascript
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
```

#### **Paradigma Funcional**  
**Arquivo**: `Estatisticas.js`  

As estatísticas são calculadas com expressões concisas e puras. Por exemplo, a média de pontuações é obtida com `reduce`:  
```javascript
const mediaPontuacao = totalQuizzes > 0
    ? dados.quizzes.reduce((acc, quiz) => acc + quiz.pontuacao, 0) / totalQuizzes
    : 0;
```

#### **Paradigma Imperativo**  
**Arquivo**: `estatisticas.js`

O script manipula diretamente o DOM para atualizar as estatísticas exibidas:  
```javascript
document.addEventListener("DOMContentLoaded", async () => {
    const estatisticas = await Estatisticas.atualizar();
    document.getElementById("totalFlashcards").textContent = estatisticas.totalFlashcardsCriados;
    document.getElementById("totalQuizzes").textContent = estatisticas.totalQuizzesRealizados;
    document.getElementById("mediaPontuacao").textContent = estatisticas.mediaPontuacao.toFixed(2);
});
```

#### **Paradigma Lógico**  
**Arquivo**: `quiz.js`

No contexto deste projeto, a implementação do paradigma lógico precisou ser adaptada porque JavaScript não é uma linguagem projetada nativamente para lógica declarativa em sua forma "pura". Linguagens como Prolog oferecem ferramentas específicas para criar regras lógicas e resolver problemas baseados em inferência, enquanto JavaScript exige que a lógica seja definida manualmente por meio de funções e expressões condicionais.

Por exemplo, a função verificarCategoria simula uma regra lógica:  
```javascript
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
```
Esta função declara claramente o critério lógico de validação, mas a verificação e aplicação dessa regra ainda dependem de estruturas imperativas para serem executadas, como loops e chamadas explícitas a funções. Em um ambiente puramente lógico, essa verificação seria feita de maneira implícita

#### **Paradigma Orientado a Eventos**  
**Arquivo**: `quizzes.js`  

Eventos são utilizados para reagir a ações do usuário, como a seleção de uma categoria e o início de um quiz:  
```javascript
document.getElementById('iniciar-quiz-btn').addEventListener('click', iniciarQuiz);
document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    listarQuizzes();
});
```

#### **Paradigma Concorrente**  
**Arquivo**: `Estatisticas.js`  

Operações assíncronas são usadas para atualizar e salvar dados no banco de forma eficiente:  
```javascript
static async atualizar() {
    const dados = await carregarDados();
    const totalFlashcards = dados.flashcards.length;
    const totalQuizzes = dados.quizzes.length;
    const mediaPontuacao = totalQuizzes > 0
        ? dados.quizzes.reduce((acc, quiz) => acc + quiz.pontuacao, 0) / totalQuizzes
        : 0;
    const novasEstatisticas = new Estatisticas(totalFlashcards, totalQuizzes, mediaPontuacao);
    dados.estatisticas = novasEstatisticas;
    await salvarDados(dados);
    return novasEstatisticas;
}
```

---

### **Resultados**  
O sistema integra múltiplos paradigmas, oferecendo uma solução robusta e versátil para:  

1. Criar e gerenciar flashcards e quizzes.  
2. Exibir estatísticas atualizadas em tempo real.  
3. Proporcionar uma experiência interativa ao usuário, com suporte a múltiplos dispositivos.  

---

### **Conclusão**  
O projeto demonstrou como paradigmas distintos podem ser aplicados em conjunto para resolver problemas complexos. Como futuras melhorias, é possível:

1. Adicionar persistência em banco de dados.  
2. Melhorar a interface gráfica para maior acessibilidade.  
3. Expandir as estatísticas com análises mais detalhadas.  