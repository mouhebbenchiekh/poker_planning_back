import cors from '@fastify/cors';
import envConfig from './config';
import Fastify from 'fastify';
import authRoute from './plugins/auth';
import connect from './db';
import mongoose from 'mongoose';
import roomRoute from './plugins/room';
import { IUser } from 'types';
import fastifyIO from 'fastify-socket.io';
import { socketService } from './services/socket';

export const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  pluginTimeout: 20000,
});

await fastify.register(cors, {
  origin: '*',
});

fastify.get('/ping', async (request, reply) => {
  return 'pong\n';
});
fastify.register(envConfig);
fastify.register(connect);
fastify.register(fastifyIO, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});
let db = mongoose.connection;

db.once('open', () => {
  console.log('connection to mongodb');
});
fastify.decorateRequest('user', '');
fastify.register(authRoute, { prefix: '/api' });
fastify.register(roomRoute, { prefix: '/api/room' });

await fastify.ready();
socketService(fastify);
fastify.listen({ port: fastify.config.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(fastify.printRoutes());
});

declare module 'fastify' {
  interface FastifyRequest {
    // you must reference the interface and not the type
    user?: IUser;
  }
}
