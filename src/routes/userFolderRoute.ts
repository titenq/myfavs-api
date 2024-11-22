import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  createFolderSchema,
  userFoldersGetByUserIdSchema
} from '@/schemas/userFolderSchema';
import {
  createFolderController,
  createLinkController,
  getFoldersByUserIdController
} from '@/controllers/userFolderController';

const userFolderRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/folders/:userId',
      { schema: userFoldersGetByUserIdSchema },
      getFoldersByUserIdController
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/folders/:userId',
      {
        schema: createFolderSchema
      },
      createFolderController
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/folders/:userId/link/:folderId',
      {
        // schema: createLinkSchema
        schema: { hide: true }
      },
      createLinkController
    );
};

export default userFolderRoute;
