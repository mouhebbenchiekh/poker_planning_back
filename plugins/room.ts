import { FastifyInstance } from 'fastify';
import { verifyToken } from '../middleware/auth';
import { RoomType } from 'models/rooms';
import { create, findById, getRooms } from '../services/room';

async function roomRoute(fastify: FastifyInstance, options: Object) {
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const room = await findById(request.params.id);
    reply.status(200).send(room);
  });
  // fastify.addHook('preHandler', await verifyToken);
  fastify.post<{ Body: { name: string; type: RoomType } }>(
    '/',
    { preHandler: [verifyToken] },

    async (request, reply) => {
      const roomData = request.body;

      return await create(request.user?.id!, roomData);
    }
  );

  fastify.get<{ Headers: { authorization: string } }>(
    '/',
    { preHandler: [verifyToken] },
    async (request, reply) => {
      const list = await getRooms(request?.user?.id!);
      reply.status(200).send(list);
    }
  );
}

export default roomRoute;
