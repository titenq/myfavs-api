import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { getUserByEmailController } from '../controllers/userController';
import { userGetByEmailSchema } from '../schemas/userSchema';

const userRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/users/:email',
      { schema: userGetByEmailSchema },
      getUserByEmailController
    );
};

export default userRoute;
