import oauthPlugin from '@fastify/oauth2';
import axios from 'axios';
/**
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
const authRoute = async (fastify, options) => {
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
        checkStateFunction: (state, callback) => {
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
            const result = await this.googleOAuth2
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
                .catch((error) => {
                reply.send(error.response?.data);
            });
            return reply.send({
                data: userinfo?.data,
                token: result.token.access_token,
            });
        }
        catch (error) {
            return reply.status(400).send(error.message);
        }
    });
};
export default authRoute;
