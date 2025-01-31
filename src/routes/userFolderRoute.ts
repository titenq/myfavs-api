import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  createFolderSchema,
  createLinkSchema,
  createLinkSubfolderSchema,
  createSubfolderSchema,
  deleteFolderSchema,
  deleteLinkSchema,
  editFolderSchema,
  editSubfolderSchema,
  userFoldersGetByUserIdSchema
} from '@/schemas/userFolderSchema';
import {
  createFolderController,
  createLinkController,
  createLinkSubfolderController,
  createSubfolderController,
  deleteFolderController,
  deleteLinkController,
  editFolderController,
  editSubfolderController,
  getFoldersByUserIdController
} from '@/controllers/userFolderController';
import verifyToken from '@/handlers/verifyTokenHandler';

const userFolderRoute = async (fastify: FastifyInstance) => {
  const routeOptions = fastify.withTypeProvider<ZodTypeProvider>();

  routeOptions.get('/folders/:userId',
    { schema: userFoldersGetByUserIdSchema },
    getFoldersByUserIdController
  );

  routeOptions.post<{
    Params: { userId: string }
    Body: { folderName: string }
  }>('/folders/:userId',
    {
      schema: createFolderSchema,
      preHandler: [verifyToken]
    },
    createFolderController
  );

  routeOptions.post('/folders/:userId/link/:folderId',
    { schema: createLinkSchema },
    createLinkController
  );

  routeOptions.post('/folders/:userId/subfolders/:folderId',
    { schema: createSubfolderSchema },
    createSubfolderController
  );

  routeOptions.post('/folders/:userId/link/:folderId/:subfolderName',
    { schema: createLinkSubfolderSchema },
    createLinkSubfolderController
  );

  routeOptions.delete('/folders/:userId/link',
    { schema: deleteLinkSchema },
    deleteLinkController
  );

  routeOptions.put('/folders/:userId',
    { schema: editFolderSchema },
    editFolderController
  );

  routeOptions.delete('/folders/:userId',
    { schema: deleteFolderSchema },
    deleteFolderController
  );

  routeOptions.put('/subfolders/:userId/:editOldSubfolderName',
    { schema: editSubfolderSchema },
    editSubfolderController
  );
};

export default userFolderRoute;
