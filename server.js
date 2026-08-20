const express = require('express');
const fs = require('fs');
const app = express();
const ARQUIVO = 'dados.json';

app.use(express.json());

// Funções utilitárias
function lerMusicas() {
  return JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'));
}

function salvarMusicas(musicas) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(musicas, null, 2));
}

// GET /musicas - Listar todas
app.get('/musicas', (req, res) => {
  res.json(lerMusicas());
});

// GET /musicas/:id - Buscar por ID
app.get('/musicas/:id', (req, res) => {
  const id = Number(req.params.id);
  const musicas = lerMusicas();
  const musica = musicas.find(m => m.id === id);

  if (!musica) {
    return res.status(404).json({ erro: 'Música não encontrada' });
  }

  res.json(musica);
});

// POST /musicas - Criar nova música
app.post('/musicas', (req, res) => {
  const musicas = lerMusicas();
  
  // Extrai explicitamente os campos esperados no body
  const { nome, musica, ano } = req.body;
  
  const novaMusica = { 
    id: Date.now(), 
    nome, 
    musica, 
    ano 
  };
  
  musicas.push(novaMusica);
  salvarMusicas(musicas);
  res.status(201).json(novaMusica);
});

// PUT /musicas/:id - Atualizar música existente
app.put('/musicas/:id', (req, res) => {
  const id = Number(req.params.id);
  const musicas = lerMusicas();
  const musica = musicas.find(m => m.id === id);

  if (!musica) {
    return res.status(404).json({ erro: 'Música não encontrada' });
  }

  Object.assign(musica, req.body);
  musica.id = id; // Garante que o ID original não seja sobrescrito pelo body
  salvarMusicas(musicas);
  res.json(musica);
});

// DELETE /musicas/:id - Remover música
app.delete('/musicas/:id', (req, res) => {
  const id = Number(req.params.id);
  const musicas = lerMusicas();
  const index = musicas.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Música não encontrada' });
  }

  const musicaRemovida = musicas.splice(index, 1);
  salvarMusicas(musicas);
  res.json(musicaRemovida[0]);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
