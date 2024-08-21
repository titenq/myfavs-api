import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createUserController, getUserByEmailController } from '../controllers/userController';
import { userCreateSchema, userGetByEmailSchema } from '../schemas/userSchema';

const userRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/users',
      { schema: userCreateSchema },
      createUserController
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/users/:email',
      { schema: userGetByEmailSchema },
      getUserByEmailController
    );
};

export default userRoute;
