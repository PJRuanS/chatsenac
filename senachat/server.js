const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Servir arquivos estáticos
app.use(express.static('public'));

// Rota padrão (apenas para teste, todos os HTMLs estão em public)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket.io apenas para chat
io.on('connection', (socket) => {
  console.log('Usuário conectado');

  socket.on('mensagem', (msg) => {
    // Envia a mensagem para todos os usuários conectados
    io.emit('mensagem', msg);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectou');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});