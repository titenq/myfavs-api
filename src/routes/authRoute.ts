import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authLoginController, authRegisterController } from '../controllers/authController';
import { authLoginSchema, authRegisterSchema } from '../schemas/authSchema';

const authRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/auth/register',
      { schema: authRegisterSchema },
      authRegisterController
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/auth/login',
      { schema: authLoginSchema },
      authLoginController
    );
};

export default authRoute;
