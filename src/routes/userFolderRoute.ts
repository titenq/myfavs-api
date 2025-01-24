import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  createFolderSchema,
  createLinkSchema,
  createLinkSubfolderSchema,
  createSubfolderSchema,
  deleteLinkSchema,
  userFoldersGetByUserIdSchema
} from '@/schemas/userFolderSchema';
import {
  createFolderController,
  createLinkController,
  createLinkSubfolderController,
  createSubfolderController,
  deleteLinkController,
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
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/folders/:userId/link/:folderId/:subfolderName',
      {
        schema: createLinkSubfolderSchema
      },
      createLinkSubfolderController
  );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .delete('/folders/:userId/link',
      {
        schema: deleteLinkSchema
      },
      deleteLinkController
    );
};

export default userFolderRoute;
