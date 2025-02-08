import { FastifyRequest, FastifyReply } from 'fastify';

import errorHandler from '@/helpers/errorHandler';
import userFolderService from '@/services/userFolderService';
import { IGenericError } from '@/interfaces/errorInterface';
import {
  ICreateFolderBody,
  ICreateFolderParams,
  ICreateFolderRequest,
  ICreateLinkBody,
  ICreateLinkParams,
  ICreateLinkRequest,
  ICreateLinkSubfolderBody,
  ICreateLinkSubfolderParams,
  ICreateLinkSubfolderRequest,
  ICreateSubfolderBody,
  ICreateSubfolderParams,
  ICreateSubfolderRequest,
  IDeleteFolderBody,
  IDeleteFolderParams,
  IDeleteFolderRequest,
  IDeleteLinkBody,
  IDeleteLinkParams,
  IDeleteLinkRequest,
  IDeleteSubfolderBody,
  IDeleteSubfolderParams,
  IDeleteSubfolderRequest,
  IEditFolderBody,
  IEditFolderParams,
  IEditFolderRequest,
  IEditSubfolderBody,
  IEditSubfolderParams,
  IEditSubfolderRequest,
  IGetFoldersByUserIdParams,
  IGetFoldersByUserIdRequest,
  IUserFolderResponse
} from '@/interfaces/userFolderInterface';

export const getFoldersByUserIdController = async (
  request: FastifyRequest<{
    Params: IGetFoldersByUserIdParams
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const getFoldersByUserIdRequest: IGetFoldersByUserIdRequest = {
      userId
    };

    const response: IUserFolderResponse | IGenericError = await userFolderService.getFoldersByUserId(getFoldersByUserIdRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(200).send(response);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao buscar pastas do usuário',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const createFolderController = async (
  request: FastifyRequest<{
    Params: ICreateFolderParams,
    Body: ICreateFolderBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { folderName } = request.body;
    const createFolderRequest: ICreateFolderRequest = {
      userId,
      folderName
    };

    const response: void | IGenericError = await userFolderService.createFolder(createFolderRequest);

    if (response && 'error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao criar pasta',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const createLinkController = async (
  request: FastifyRequest<{
    Params: ICreateLinkParams,
    Body: ICreateLinkBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId, folderId } = request.params;
    const link = request.body;
    const createLinkRequest: ICreateLinkRequest = {
      userId,
      link,
      folderId
    };

    const response: IUserFolderResponse | IGenericError = await userFolderService.createLink(createLinkRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao criar link',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const createSubfolderController = async (
  request: FastifyRequest<{
    Params: ICreateSubfolderParams,
    Body: ICreateSubfolderBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId, folderId } = request.params;
    const { subfolderName } = request.body;
    const createSubfolderRequest: ICreateSubfolderRequest = {
      userId,
      folderId,
      subfolderName
    };

    const response: IUserFolderResponse | IGenericError = await userFolderService.createSubfolder(createSubfolderRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao criar link',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const createLinkSubfolderController = async (
  request: FastifyRequest<{
    Params: ICreateLinkSubfolderParams,
    Body: ICreateLinkSubfolderBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId, folderId, subfolderName } = request.params;
    const link = request.body;
    const createLinkSubfolderRequest: ICreateLinkSubfolderRequest = {
      userId,
      link,
      folderId,
      subfolderName
    };

    const response: { picture: string } | IGenericError = await userFolderService.createLinkSubfolder(createLinkSubfolderRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);
      
      return;
    }

    reply.status(200).send(response);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao criar link na subpasta',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const deleteLinkController = async (
  request: FastifyRequest<{
    Params: IDeleteLinkParams,
    Body: IDeleteLinkBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const deleteLinkRequest: IDeleteLinkRequest = {
      userId,
      deleteLink: request.body
    };

    const response: { delete: boolean } | IGenericError = await userFolderService.deleteLink(deleteLinkRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao deletar link',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const editFolderController = async (
  request: FastifyRequest<{
    Params: IEditFolderParams,
    Body: IEditFolderBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { editFolderId, editFolderName } = request.body;
    const editFolderRequest: IEditFolderRequest = {
      userId,
      editFolderId,
      editFolderName
    };

    const response: { ok: true } | IGenericError = await userFolderService.editFolder(editFolderRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao editar pasta',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const deleteFolderController = async (
  request: FastifyRequest<{
    Params: IDeleteFolderParams,
    Body: IDeleteFolderBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { deleteFolderId } = request.body;
    const deleteFolderRequest: IDeleteFolderRequest = {
      userId,
      deleteFolderId
    };

    const response: { delete: boolean } | IGenericError = await userFolderService.deleteFolder(deleteFolderRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao deletar pasta',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const editSubfolderController = async (
  request: FastifyRequest<{
    Params: IEditSubfolderParams,
    Body: IEditSubfolderBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId, editOldSubfolderName } = request.params;
    const { editFolderId, editSubfolderName } = request.body;
    const editSubfolderRequest: IEditSubfolderRequest = {
      userId,
      editFolderId,
      editOldSubfolderName,
      editSubfolderName
    };

    const response: { ok: true } | IGenericError = await userFolderService.editSubfolder(editSubfolderRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao editar subpasta',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const deleteSubfolderController = async (
  request: FastifyRequest<{
    Params: IDeleteSubfolderParams,
    Body: IDeleteSubfolderBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { deleteFolderId, deleteSubfolderName } = request.body;
    const deleteSubfolderRequest: IDeleteSubfolderRequest = {
      userId,
      deleteFolderId,
      deleteSubfolderName
    };

    const response: { delete: boolean } | IGenericError = await userFolderService.deleteSubfolder(deleteSubfolderRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao deletar subpasta',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};
