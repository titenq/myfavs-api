import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  getUserByEmailController,
  getUserByIdController,
  getUsersController
} from 'src/controllers/userController';
import {
  userGetByEmailSchema,
  userGetByIdSchema,
  userGetSchema
} from 'src/schemas/userSchema';

const userRoute = async (fastify: FastifyInstance) => {
  const routeOptions = fastify.withTypeProvider<ZodTypeProvider>();

  routeOptions.get('/users/username/:userId',
    { schema: userGetByIdSchema },
    getUserByIdController
  );

  routeOptions.get('/users/:email',
    { schema: userGetByEmailSchema },
    getUserByEmailController
  );

  routeOptions.get('/users',
    { schema: userGetSchema },
    getUsersController
  );
};

export default userRoute;
