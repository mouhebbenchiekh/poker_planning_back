import cors from '@fastify/cors';
import envConfig from './config';
import Fastify from 'fastify';
import authRoute from './plugins/auth';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import connect from './db';
import mongoose from 'mongoose';
import roomRoute from './plugins/room';

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

/* const intialize = async () => {
  fastify.register(envConfig);
  await fastify.after(); // important as it waits for plugin to stop loading
  console.log('config is: ', fastify.config.DATABASE_URL);
};
intialize(); */

await fastify.register(cors, {
  origin: '*',

  // put your options here
});
/* connect(fastify);
let db = mongoose.connection;

db.once('open', () => {
  console.log('connection to mongodb');
 */

fastify.get('/ping', async (request, reply) => {
  return 'pong\n';
});
fastify.register(envConfig);
fastify.register(connect);
let db = mongoose.connection;

db.once('open', () => {
  console.log('connection to mongodb');
});
fastify.register(authRoute, { prefix: '/api' });
fastify.register(roomRoute, { prefix: '/api/room' });
await fastify.ready();

fastify.listen({ port: fastify.config.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(fastify.printRoutes());
});
