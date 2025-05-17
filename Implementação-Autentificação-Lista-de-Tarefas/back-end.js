const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Dados iniciais
let tasks = [
    { id: 1, title: 'Estudar Node.js', completed: false },
    { id: 2, title: 'Fazer compras', completed: true }
];

// Credenciais válidas (simplificado para demonstração)
const validUser = {
    username: 'admin',
    password: 'senha123'
};

// Token válido (simplificado)
const validToken = 'seu-token-simples';

// Middleware de autenticação
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader === validToken) {
        next();
    } else {
        res.status(403).json({ error: 'Acesso negado. Token inválido ou não fornecido.' });
    }
}

// Rota de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === validUser.username && password === validUser.password) {
        res.json({ 
            message: 'Login bem-sucedido',
            token: validToken
        });
    } else {
        res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }
});

// Rotas de tarefas (protegidas)
// GET /tasks - Listar todas as tarefas
app.get('/tasks', authenticate, (req, res) => {
    res.json(tasks);
});

// POST /task - Adicionar nova tarefa
app.post('/task', authenticate, (req, res) => {
    const { title } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Título da tarefa é obrigatório' });
    }
    
    const newTask = {
        id: tasks.length + 1,
        title,
        completed: false
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Rota raiz
app.get('/', (req, res) => {
    res.send('Bem-vindo à API de Lista de Tarefas. Faça login para acessar as tarefas.');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});