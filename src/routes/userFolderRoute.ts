import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  createFolderSchema,
  createLinkSchema,
  createSubfolderSchema,
  userFoldersGetByUserIdSchema
} from '@/schemas/userFolderSchema';
import {
  createFolderController,
  createLinkController,
  createSubfolderController,
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
        schema: createLinkSchema
      },
      createLinkController
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/folders/:userId/subfolders/:folderId',
      {
        schema: createSubfolderSchema
      },
      createSubfolderController
    );
};

export default userFolderRoute;
