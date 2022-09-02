import { FastifyInstance } from 'fastify';
import { RoomType } from 'models/rooms';
import { createRoom, getRooms, getUser } from '../services/room';

async function roomRoute(fastify: FastifyInstance, options: Object) {
  fastify.post<{ Body: { token: string; name: string; type: RoomType } }>(
    '/',
    async (request, reply) => {
      const { token, name, type } = request.body;

      if (!token) {
        reply.status(401).send('unauthorized');
      }
      const result: any = await getUser(token);
      if (!result) {
        reply.status(401).send('unauthorized');
      }
      return await createRoom(result.user?.id, name, type);
    }
  );

  fastify.get<{ Params: { id: string }; Headers: { authorization: string } }>(
    '/',
    async (request, reply) => {
      console.log({ header: request.headers });
      const token = request.headers.authorization.split(' ');
      console.log({ token });

      const result = await getUser(token[1]);
      const list = await getRooms(result?.user?.id);
      reply.status(200).send(list);
    }
  );
}

export default roomRoute;
