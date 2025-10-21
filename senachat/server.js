const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Servir arquivos estáticos
app.use(express.static('public'));

// Rota padrão (abre o chat)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html'); // abre chat.html diretamente
});

// Socket.io para chat
io.on('connection', (socket) => {
  console.log('Usuário conectado');

  // Evento de login do usuário
  socket.on('user login', (username) => {
    socket.username = username; // guarda o nome do usuário
    // envia mensagem de sistema para todos
    io.emit('mensagem', { system: true, text: `${username} entrou no chat.` });
  });

  // Evento de envio de mensagem
  socket.on('mensagem', (data) => {
    // espera que data seja { user: 'Nome', text: 'Mensagem' }
    io.emit('mensagem', data);
  });

  // Desconexão do usuário
  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('mensagem', { system: true, text: `${socket.username} saiu do chat.` });
    }
    console.log('Usuário desconectou');
  });
});

// Porta do Render ou 3000 local
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
