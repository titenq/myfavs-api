import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import verifyRecaptcha from 'src/handlers/verifyRecaptchaHandler';
import {
  authForgotPasswordController,
  authLoginController,
  authLogoutController,
  authRegisterController,
  authResendLinkController,
  authResetPasswordController,
  authVerifyEmailController
} from 'src/controllers/authController';
import {
  authForgotPasswordSchema,
  authLoginSchema,
  authRegisterSchema,
  authResendLinkSchema,
  authResetPasswordSchema,
  authVerifyEmailSchema
} from 'src/schemas/authSchema';
import {
  IAuthForgotPasswordBody,
  IAuthForgotPasswordHeaders,
  IAuthLoginBody,
  IAuthLoginHeaders,
  IAuthRegisterBody,
  IAuthRegisterHeaders
} from 'src/interfaces/authInterface';

const authRoute = async (fastify: FastifyInstance) => {
  const routeOptions = fastify.withTypeProvider<ZodTypeProvider>();

  routeOptions.post<{
    Body: IAuthRegisterBody,
    Headers: IAuthRegisterHeaders
  }>('/auth/register',
    {
      schema: authRegisterSchema,
      preHandler: [verifyRecaptcha]
    },
    authRegisterController
  );

  routeOptions.post<{
    Headers: IAuthLoginHeaders,
    Body: IAuthLoginBody
  }>('/auth/login',
    {
      schema: authLoginSchema,
      preHandler: [verifyRecaptcha]
    },
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

  routeOptions.post<{
    Body: IAuthForgotPasswordBody,
    Headers: IAuthForgotPasswordHeaders
  }>('/auth/forgot-password',
    {
      schema: authForgotPasswordSchema,
      preHandler: [verifyRecaptcha]
    },
    authForgotPasswordController
  );

  routeOptions.post('/auth/reset-password',
    { schema: authResetPasswordSchema },
    authResetPasswordController
  );
};

export default authRoute;
