import { FastifyInstance } from 'fastify';

import { pingController } from '../controllers/pingController';

const pingRoute = async (fastify: FastifyInstance) => {
  fastify.get('/ping',
    { schema: { hide: true } },
    pingController
  );
};

export default pingRoute;
