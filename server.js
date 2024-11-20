const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = 3000;

const filePath = path.join(__dirname, 'data', 'database.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/dados', async (req, res) => {
    try {
        const dados = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(dados));
    } catch (error) {
        if (error.code === 'ENOENT') {
            const dadosIniciais = { flashcards: [], categorias: [], quizzes: [], estatisticas: [] };
            await fs.writeFile(filePath, JSON.stringify(dadosIniciais, null, 2));
            res.json(dadosIniciais);
        } else {
            res.status(500).json({ error: 'Erro ao carregar dados.' });
        }
    }
});

app.post('/api/dados', async (req, res) => {
    try {
        const dados = req.body;
        await fs.writeFile(filePath, JSON.stringify(dados, null, 2));
        res.status(200).json({ message: 'Dados salvos com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar dados.' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
