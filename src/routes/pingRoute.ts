import { pingController } from '../controllers/pingController.js';

const pingRoute = async fastify => {
  fastify.get('/ping',
    { schema: { hide: true } },
    pingController
  );
};

export default pingRoute;
