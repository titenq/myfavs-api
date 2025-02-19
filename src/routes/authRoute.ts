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
  const routeOptions = fastify.withTypeProvider<ZodTypeProvider>();

  routeOptions.post('/auth/register',
    { schema: authRegisterSchema },
    authRegisterController
  );

  routeOptions.post('/auth/login',
    { schema: authLoginSchema },
    authLoginController
  );

  routeOptions.post('/auth/logout',
    {
      schema: { hide: true }
    },
    authLogoutController
  );
  
  routeOptions.post('/auth/verify-email',
    { schema: authVerifyEmailSchema },
    authVerifyEmailController
  );

  routeOptions.post('/auth/resend-link',
    { schema: authResendLinkSchema },
    authResendLinkController
  );

  routeOptions.post('/auth/forgot-password',
    { schema: authForgotPasswordSchema },
    authForgotPasswordController
  );

  routeOptions.post('/auth/reset-password',
    { schema: authResetPasswordSchema },
    authResetPasswordController
  );
};

export default authRoute;
