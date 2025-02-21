import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { pingController } from 'src/controllers/pingController';

const pingRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/ping',
      { schema: { hide: true } },
      pingController
    );
};

export default pingRoute;
