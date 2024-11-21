import { carregarDados, salvarDados } from '../utils.js';

class Categoria {
    
    constructor(nome, descricao) {
        this.id = Date.now();
        this.nome = nome;
        this.descricao = descricao;
    }

    static async adicionar(nome, descricao) {
        const dados = await carregarDados();
        const novaCategoria = new Categoria(nome, descricao);
        dados.categorias.push(novaCategoria);
        await salvarDados(dados);
        return novaCategoria;
    }

    static async listar() {
        const dados = await carregarDados();
        return dados.categorias;
    }

    // Método para buscar categoria pelo ID
    static async buscar(categoriaId) {
        const dados = await carregarDados();
        return dados.categorias.find(categoria => categoria.id === categoriaId);
    }
}

export { Categoria };
