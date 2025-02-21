import { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

import createErrorMessage from '../helpers/createErrorMessage';

const configRateLimit = async (app: FastifyInstance) => {
  await app.register(rateLimit, {
    max: 300,
    timeWindow: '1 minute',
    ban: 3,
    allowList: ['127.0.0.1'],
    errorResponseBuilder: function (request, context) {
      const message = context.ban
        ? 'IP banido temporariamente devido a múltiplas violações'
        : 'Muitas requisições, tente novamente mais tarde';

      const errorMessage = createErrorMessage(message, 429);

      return errorMessage;
    }
  });
};

export default configRateLimit;
