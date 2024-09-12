import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  authLoginController,
  authLogoutController,
  authRegisterController,
  authVerifyEmailController
} from '@/controllers/authController';
import {
  authLoginSchema,
  authRegisterSchema,
  authVerifyEmailSchema
} from '@/schemas/authSchema';

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

  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/auth/logout',
      { schema: { hide: true } },
      authLogoutController
  );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/auth/verify-email',
      { schema: authVerifyEmailSchema },
      authVerifyEmailController
    );
};

export default authRoute;
