import { FastifyRequest, FastifyReply } from 'fastify';

import errorHandler from 'src/helpers/errorHandler';
import userFolderService from 'src/services/userFolderService';
import { IGenericError } from 'src/interfaces/errorInterface';
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
  ICreateLinkSubfolderResponse,
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
  IGetPublicFoldersByUsernameParams,
  IUserFolderResponse
} from 'src/interfaces/userFolderInterface';
import createErrorMessage from 'src/helpers/createErrorMessage';

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
    const errorMessage = createErrorMessage('erro ao buscar pastas do usuário');

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
    const errorMessage = createErrorMessage('erro ao criar pasta');

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
    const errorMessage = createErrorMessage('erro ao criar link');

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
    const errorMessage = createErrorMessage('erro ao criar link');

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

    const response: ICreateLinkSubfolderResponse | IGenericError = await userFolderService.createLinkSubfolder(createLinkSubfolderRequest);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(200).send(response);
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao criar link na subpasta');

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

    const response: void | IGenericError = await userFolderService.deleteLink(deleteLinkRequest);

    if (response && 'error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao deletar link');

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

    const response: void | IGenericError = await userFolderService.editFolder(editFolderRequest);

    if (response && 'error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao editar pasta');

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

    const response: void | IGenericError = await userFolderService.deleteFolder(deleteFolderRequest);

    if (response && 'error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao deletar pasta');

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

    const response: void | IGenericError = await userFolderService.editSubfolder(editSubfolderRequest);

    if (response && 'error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao editar subpasta');

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

    const response: void | IGenericError = await userFolderService.deleteSubfolder(deleteSubfolderRequest);

    if (response && 'error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao deletar subpasta');

    errorHandler(errorMessage, request, reply);
  }
};

export const getLinksController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const response = await userFolderService.getLinks();

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(200).send(response);
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao buscar links');

    errorHandler(errorMessage, request, reply);
  }
};

export const getPublicFoldersByUsernameController = async (
  request: FastifyRequest<{
    Params: IGetPublicFoldersByUsernameParams
  }>,
  reply: FastifyReply
) => {
  try {
    const { username } = request.params;

    const response: IUserFolderResponse | IGenericError = await userFolderService.getPublicFoldersByUsername({ username });

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(200).send(response);
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao buscar pastas com links públicos de um usuário');

    errorHandler(errorMessage, request, reply);
  }
};
