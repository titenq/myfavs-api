import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createUserController, getUserByEmailController } from '../controllers/userController';
import { userCreateSchema, userGetByEmailSchema } from '../schemas/userSchema';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email()
});

const userRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/users',
      { schema: userCreateSchema },
      // { schema: { hide: true } },
      createUserController
    );
  
  /* fastify.withTypeProvider<ZodTypeProvider>()
    .post('/users',
      {
        schema: {
          body: userSchema
        }
      },
      createUserController
    ); */

  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/users/:email',
      // { schema: userGetByEmailSchema },
      { schema: { hide: true } },
      getUserByEmailController
    );
};

export default userRoute;
