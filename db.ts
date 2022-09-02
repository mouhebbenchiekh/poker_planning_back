import fastify, {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import mongoose from 'mongoose';

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

const connect: FastifyPluginCallback<FastifyPluginOptions> = (
  fastify: FastifyInstance,
  options,
  done
) => {
  console.log({ database: fastify.config.DATABASE_URL });
  mongoose.connect(fastify.config.DATABASE_URL, {});
  done();
};
export default fastifyPlugin(connect);
