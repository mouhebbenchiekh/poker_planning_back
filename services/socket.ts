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

    socket.on('leave_room', ({ room, userId }) => {
      console.log({ room, id: socket.id, userId });
      users = users.filter((user) => user.userId !== userId);
      console.log({ users }, 'leave');
      let roomUsers = users.filter((user) => user.room === room);
      socket.to(room).emit('room_users', roomUsers);
      socket.leave(room);
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
    socket.on('flip_cards', ({ room }) => {
      console.log('flippp', room);
      socket.to(room).emit('flip');
      socket.emit('flip');
    });
    socket.on('newStory', ({ room }) => {
      console.log({ room });
      users = users.map((user) => {
        if (user.room === room) {
          return { ...user, value: '' };
        }
        return user;
      });

      let roomUsers = users.filter((user) => user.room === room);
      console.log({ roomUsers });
      socket.to(room).emit('room_users', roomUsers);
      socket.emit('room_users', roomUsers);
    });

    // ...
  });
};
