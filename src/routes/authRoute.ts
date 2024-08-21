import { authLoginController, authRegisterController } from '../controllers/authController.js';
import { authLoginSchema, authRegisterSchema } from '../schemas/authSchema.js';

const authRoute = async fastify => {
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
