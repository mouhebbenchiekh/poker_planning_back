import { FastifyInstance } from 'fastify';
import { ISocketUser } from 'types';

export const socketService = (fastify: FastifyInstance) => {
  let users: ISocketUser[] = [];

  fastify.io.on('connection', (socket) => {
    console.log('Socket connected!', 'id', socket.id);

    socket.on('join_room', (data) => {
      const { username, room, userId } = data;
      socket.join(room);
      let userIndex = users.findIndex(
        (user) => user.userId === userId && user.room === room
      );
      if (userIndex !== -1) {
        users[userIndex] = { id: socket.id, username, room, userId };
      } else {
        users.push({ id: socket.id, username, room, value: '', userId });
      }
      let roomUsers = users.filter((user) => user.room === room);
      socket.to(room).emit('room_users', roomUsers);
      socket.emit('room_users', roomUsers);
    });

    socket.on('disconnect', () => {
      const index = users.findIndex((user) => user.id === socket.id);
      const user = users[index];
      users = users.filter((user) => user.id !== socket.id);
      let roomUsers = users.filter((user) => user.room === user.room);
      socket.to(user?.room).emit('room_users', roomUsers);
      socket.leave(user?.room);
    });
    socket.on('reload_room', (room) => {
      socket.to(room).emit('reload');
      socket.emit('reload');
    });
    socket.on('send_value', ({ room, username, value, userId }) => {
      users = users.map((user) => {
        if (user.room === room && user.userId === userId) {
          return { id: socket.id, room: user.room, username, value, userId };
        } else {
          return user;
        }
      });
      let roomUsers = users.filter((user) => user.room === room);
      socket.to(room).emit('room_users', roomUsers);
      socket.emit('room_users', roomUsers);
    });
    socket.on('flip_cards', ({ room, face }) => {
      socket.to(room).emit('flip', face);
      socket.emit('flip', face);
    });
    socket.on('newStory', ({ room }) => {
      users = users.map((user) => {
        if (user.room === room) {
          return { ...user, value: '' };
        }
        return user;
      });

      let roomUsers = users.filter((user) => user.room === room);
      socket.to(room).emit('room_users', roomUsers);
      socket.emit('room_users', roomUsers);
    });

    // ...
  });
};
