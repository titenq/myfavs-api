import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { userFoldersGetByUserIdSchema } from '@/schemas/userFolderSchema';
import { getFoldersByUserIdController } from '@/controllers/userFolderController';

const userFolderRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/folders/:userId',
      { schema: userFoldersGetByUserIdSchema },
      getFoldersByUserIdController
    );
  
  /* fastify.withTypeProvider<ZodTypeProvider>()
    .post('/folders/:userId',
      // { schema: userFoldersGetByUserIdSchema },
      { schema: { hide: true }},
      createFolderController
    ); */
};

export default userFolderRoute;
