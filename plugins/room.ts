import { FastifyInstance } from 'fastify';
import { verifyToken } from '../middleware/auth';
import { RoomType } from 'models/rooms';
import { create, findById, getRooms, update } from '../services/room';

async function roomRoute(fastify: FastifyInstance, options: Object) {
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const room = await findById(request.params.id);
    reply.status(200).send(room);
  });
  fastify.post<{ Body: { name: string; type: RoomType } }>(
    '/',
    { preHandler: [verifyToken] },

    async (request, reply) => {
      const roomData = request.body;

      return await create(request.user?.id!, roomData);
    }
  );

  fastify.put<{
    Body: { name: string; type: RoomType };
    Params: { id: string };
  }>(
    '/:id',
    { preHandler: [verifyToken] },

    async (request, reply) => {
      const roomData = request.body;

      return reply.status(200).send(await update(request.params.id, roomData));
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
