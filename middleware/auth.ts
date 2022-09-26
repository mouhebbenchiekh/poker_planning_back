import axios from 'axios';
import { FastifyReply, FastifyRequest } from 'fastify';

export const verifyToken = async (req: FastifyRequest, res: FastifyReply) => {
  let token = req.headers.authorization;
  if (!token) {
    res.status(401).send('unauthorized');
  }

  const { data } = await axios.get(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: {
        Authorization: token!,
      },
    }
  );

  if (data) {
    req.user = data;
  } else {
    return res.status(401).send('wrong token');
  }
};
