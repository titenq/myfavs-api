import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  authForgotPasswordController,
  authLoginController,
  authLogoutController,
  authRegisterController,
  authResendLinkController,
  authResetPasswordController,
  authVerifyEmailController
} from '@/controllers/authController';
import {
  authForgotPasswordSchema,
  authLoginSchema,
  authRegisterSchema,
  authResendLinkSchema,
  authResetPasswordSchema,
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
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/auth/resend-link',
      { schema: authResendLinkSchema },
      authResendLinkController
    );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/auth/forgot-password',
      { schema: authForgotPasswordSchema },
      authForgotPasswordController
    );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/auth/reset-password',
      { schema: authResetPasswordSchema },
      authResetPasswordController
    );
};

export default authRoute;
