const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const { send } = require('#facades/chat');
const { JWT_SECRET } = require('#configs/jwt');

let io;

function initSocket(server) {
  io = socketio(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));

    try {
      const user = jwt.verify(token, JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.id} connected`);

    socket.on('message', async ({ toUserId, text }) => {
      const fromUserId = socket.user.id;
      const message = await send({ fromUserId, toUserId, text });

      // Отправить сообщение себе и получателю (если в сети)
      socket.emit('message', message);
      socket.broadcast.emit('message', message); // для простоты без комнат
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.id} disconnected`);
    });
  });
}

socket.on('joinRoom', (room) => {
  socket.join(room);
});

socket.on('groupMessage', async ({ room, text }) => {
  const fromUserId = socket.user.id;

  const message = await Message.create({
    fromUserId,
    text,
    room, // ← это групповой чат
    toUserId: null,
  });

  // Отправка сообщения всем в комнате(мне тоже)
  io.to(room).emit('groupMessage', message);
});
