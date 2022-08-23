import cors from '@fastify/cors'
import Fastify from 'fastify';
import authRoute from './plugins/auth'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie' 


const fastify = Fastify({logger:{transport:

     {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    }})

 await fastify.register(cors, { 
  "origin": "*",
  
  // put your options here
})



fastify.get('/ping', async (request, reply) => {
  return 'pong\n'
})

fastify.register(authRoute);


fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})