import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { getUserByEmailController, getUserByIdController } from '@/controllers/userController';
import { userGetByEmailSchema, userGetByIdSchema } from '@/schemas/userSchema';

const userRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/users/username/:userId',
      { schema: userGetByIdSchema },
      getUserByIdController
  );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/users/:email',
      { schema: userGetByEmailSchema },
      getUserByEmailController
  );
};

export default userRoute;
