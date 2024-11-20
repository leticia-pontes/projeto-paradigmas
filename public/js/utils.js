const API_URL = '/api/dados';

// Carregar dados do servidor
export async function carregarDados() {
    try {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) throw new Error('Erro ao carregar dados');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        return { flashcards: [], categorias: [], quizzes: [], estatisticas: [] };
    }
}

// Salvar dados no servidor
export async function salvarDados(dados) {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
        if (!response.ok) throw new Error('Erro ao salvar dados');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
}
