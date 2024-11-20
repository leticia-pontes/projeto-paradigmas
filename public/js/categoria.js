import { Categoria } from '../js/classes/Categoria.js';
import { carregarDados, salvarDados } from '../js/utils.js';

// Função para listar as categorias
async function listarCategorias() {
    const categorias = await Categoria.listar();

    const categoriaListDiv = document.getElementById('categoria-list');
    categoriaListDiv.innerHTML = '';

    if (categorias.length === 0) {
        categoriaListDiv.innerHTML = '<p>Nenhuma categoria encontrada</p>';
        return;
    }

    categorias.forEach(categoria => {
        const categoriaElement = document.createElement('div');
        categoriaElement.classList.add('categoria');

        categoriaElement.innerHTML = `
            <h3>${categoria.nome}</h3>
            <p>${categoria.descricao}</p>
            <div class="actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

        // Adicionar listeners para os ícones de editar e excluir
        const editButton = categoriaElement.querySelector('.edit-btn');
        editButton.addEventListener('click', () => editarCategoria(categoria.id));

        const deleteButton = categoriaElement.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => excluirCategoria(categoria.id));

        categoriaListDiv.appendChild(categoriaElement);
    });
}

// Função para editar uma categoria
async function editarCategoria(id) {
    const categorias = await Categoria.listar();
    const categoria = categorias.find(c => c.id === id);

    if (categoria) {
        const novoNome = prompt('Editar Nome da Categoria:', categoria.nome);
        const novaDescricao = prompt('Editar Descrição da Categoria:', categoria.descricao);

        if (novoNome && novaDescricao) {
            categoria.nome = novoNome;
            categoria.descricao = novaDescricao;
            await salvarDados(categorias);
            listarCategorias();
        }
    }
}

// Função para excluir uma categoria
async function excluirCategoria(id) {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta categoria?');
    if (confirmDelete) {
        const categorias = await Categoria.listar();
        const categoriasFiltradas = categorias.filter(c => c.id !== id);
        await salvarDados({ categorias: categoriasFiltradas });
        listarCategorias();
    }
}

// Função para adicionar nova categoria
async function adicionarCategoria() {
    const nome = prompt('Nome da Categoria:');
    const descricao = prompt('Descrição da Categoria:');

    if (nome && descricao) {
        await Categoria.adicionar(nome, descricao);
        listarCategorias();
    }
}

// Evento para carregar as categorias
document.addEventListener('DOMContentLoaded', () => {
    listarCategorias();

    // Adicionar ação ao botão de criar categoria
    const criarCategoriaButton = document.getElementById('criar-categoria-btn');
    criarCategoriaButton.addEventListener('click', adicionarCategoria);
});
