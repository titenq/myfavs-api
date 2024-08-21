import { FastifyInstance } from 'fastify';

import { authLoginController, authRegisterController } from '../controllers/authController';
import { authLoginSchema, authRegisterSchema } from '../schemas/authSchema';

const authRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider()
    .post('/auth/register',
      { schema: authRegisterSchema },
      authRegisterController
    );

  fastify.withTypeProvider()
    .get('/auth/login',
      { schema: authLoginSchema },
      authLoginController
    );
};

export default authRoute;
