import { FastifyInstance } from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyPlugin from 'fastify-plugin';
import { FastifyValidationResult } from 'fastify/types/schema';

const schema = {
  type: 'object',
  required: ['PORT', 'DATABASE_URL'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
    DATABASE_URL: {
      type: 'string',
      default: 'mouheb',
    },
    FRONTEND_URL: {
      type: 'string',
    },
  },
};

const options = {
  confKey: 'config', // optional, default: 'config'
  schema: schema,
  dotenv: true,
};

const envConfig = async (fastify: FastifyInstance) => {
  fastify.register(fastifyEnv, options).after((err) => {
    if (err) throw err;
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      DATABASE_URL: string;
      PORT: number;
      FRONTEND_URL: string;
    };
  }
}
export default fastifyPlugin(envConfig);
