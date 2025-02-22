import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import verifyToken from '../handlers/verifyTokenHandler';
import {
  createFolderSchema,
  createLinkSchema,
  createLinkSubfolderSchema,
  createSubfolderSchema,
  deleteFolderSchema,
  deleteLinkSchema,
  deleteSubfolderSchema,
  editFolderSchema,
  editSubfolderSchema,
  userFoldersGetByUserIdSchema,
  userPublicFoldersGetByUsernameSchema
} from '../schemas/userFolderSchema';
import {
  createFolderController,
  createLinkController,
  createLinkSubfolderController,
  createSubfolderController,
  deleteFolderController,
  deleteLinkController,
  deleteSubfolderController,
  editFolderController,
  editSubfolderController,
  getFoldersByUserIdController,
  getLinksController,
  getPublicFoldersByUsernameController
} from '../controllers/userFolderController';
import {
  ICreateFolderBody,
  ICreateFolderParams,
  ICreateLinkBody,
  ICreateLinkParams,
  ICreateLinkSubfolderBody,
  ICreateLinkSubfolderParams,
  ICreateSubfolderBody,
  ICreateSubfolderParams,
  IDeleteFolderBody,
  IDeleteFolderParams,
  IDeleteLinkBody,
  IDeleteLinkParams,
  IDeleteSubfolderBody,
  IDeleteSubfolderParams,
  IEditFolderBody,
  IEditFolderParams,
  IEditSubfolderBody,
  IEditSubfolderParams,
  IGetFoldersByUserIdParams,
  IGetPublicFoldersByUsernameParams
} from '../interfaces/userFolderInterface';

const userFolderRoute = async (fastify: FastifyInstance) => {
  const routeOptions = fastify.withTypeProvider<ZodTypeProvider>();

  routeOptions.get('/folders/links',
    { schema: { hide: true } },
    getLinksController
  );

  routeOptions.get<{
    Params: IGetPublicFoldersByUsernameParams
  }>('/folders/public/:username',
    { schema: userPublicFoldersGetByUsernameSchema },
    getPublicFoldersByUsernameController
  );

  routeOptions.get<{
    Params: IGetFoldersByUserIdParams
  }>('/folders/:userId',
    { schema: userFoldersGetByUserIdSchema },
    getFoldersByUserIdController
  );

  routeOptions.post<{
    Params: ICreateFolderParams,
    Body: ICreateFolderBody,
  }>('/folders/:userId',
    {
      schema: userFoldersGetByUserIdSchema,
      preHandler: [verifyToken]
    },
    createFolderController
  );

  routeOptions.post<{
    Params: ICreateLinkParams,
    Body: ICreateLinkBody
  }>('/folders/:userId/link/:folderId',
    {
      schema: createLinkSchema,
      preHandler: [verifyToken]
    },
    createLinkController
  );

  routeOptions.post<{
    Params: ICreateSubfolderParams,
    Body: ICreateSubfolderBody
  }>('/folders/:userId/subfolders/:folderId',
    {
      schema: createSubfolderSchema,
      preHandler: [verifyToken]
    },
    createSubfolderController
  );

  routeOptions.post<{
    Params: ICreateLinkSubfolderParams,
    Body: ICreateLinkSubfolderBody
  }>('/folders/:userId/link/:folderId/:subfolderName',
    {
      schema: createLinkSubfolderSchema,
      preHandler: [verifyToken]
    },
    createLinkSubfolderController
  );

  routeOptions.delete<{
    Params: IDeleteLinkParams,
    Body: IDeleteLinkBody
  }>('/folders/:userId/link',
    {
      schema: deleteLinkSchema,
      preHandler: [verifyToken]
    },
    deleteLinkController
  );

  routeOptions.put<{
    Params: IEditFolderParams,
    Body: IEditFolderBody
  }>('/folders/:userId',
    {
      schema: editFolderSchema,
      preHandler: [verifyToken]
    },
    editFolderController
  );

  routeOptions.delete<{
    Params: IDeleteFolderParams,
    Body: IDeleteFolderBody
  }>('/folders/:userId',
    {
      schema: deleteFolderSchema,
      preHandler: [verifyToken]
    },
    deleteFolderController
  );

  routeOptions.put<{
    Params: IEditSubfolderParams,
    Body: IEditSubfolderBody
  }>('/subfolders/:userId/:editOldSubfolderName',
    {
      schema: editSubfolderSchema,
      preHandler: [verifyToken]
    },
    editSubfolderController
  );

  routeOptions.delete<{
    Params: IDeleteSubfolderParams,
    Body: IDeleteSubfolderBody
  }>('/subfolders/:userId',
    {
      schema: deleteSubfolderSchema,
      preHandler: [verifyToken]
    },
    deleteSubfolderController
  );
};

export default userFolderRoute;
