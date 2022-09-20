import oauthPlugin, { OAuth2Token, Token } from '@fastify/oauth2';
import fastifyPlugin from 'fastify-plugin';
import fastify, {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyRequest,
} from 'fastify';
import { FastifyReply, ReplyGenericInterface } from 'fastify/types/reply';
import { OAuth2Namespace } from '@fastify/oauth2';
import axios, { AxiosError } from 'axios';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
    myCustomOAuth2: OAuth2Namespace;
  }
}

/**
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */

const authRoute: FastifyPluginAsync<FastifyPluginOptions> = async (
  fastify: FastifyInstance,
  options: Object
) => {
  fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: '578500318926-m0qaca6s3ifu50i4d8vnsmegq8ij8rh9.apps.googleusercontent.com',
        secret: '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',
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: '/',
    checkStateFunction: (state: string, callback: (arg?: Error) => void) => {
      if (state === 'mouheb') {
        callback();
        return;
      }
      console.log({ state }, 'heeeeeeereee /n');
      callback(new Error('Invalid state mouheb '));
    },
    generateStateFunction: () => {
      return 'mouheb';
    },

    // facebook redirect here after the user login
    callbackUri: 'http://poker.planning.org',
  });

  fastify.get('/login/google/callback', async function (request, reply) {
    try {
      const result: OAuth2Token = await this.googleOAuth2
        .getAccessTokenFromAuthorizationCodeFlow(request)
        .catch((error) => {
          console.log({ errrrrrror: error });
          return reply.status(408).send({ error });
        });

      const userinfo = await axios
        .get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: 'Bearer ' + result.token.access_token,
          },
        })
        .catch((error: AxiosError) => {
          reply.send(error.response?.data);
        });

      return reply.send({
        data: userinfo?.data,
        token: result.token,
      });
    } catch (error: any) {
      return reply.status(400).send(error.message);
    }
  });
  fastify.post<{ Body: { token: Token }; Params: Object }>(
    '/refresh',
    async function (request, reply) {
      const refresh_token = request.body.token;
      if (refresh_token) {
        const result: OAuth2Token = (await this.googleOAuth2
          .getNewAccessTokenUsingRefreshToken(refresh_token, request.params)
          .catch((error) => {
            console.log({ refreshError: error });
          })) as OAuth2Token;
        reply.send(result);
      }
      reply.status(401).send('forbidden');
    }
  );
};
export default authRoute;
