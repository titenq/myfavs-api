import { FastifyRequest, FastifyReply } from 'fastify';

import errorHandler from '@/helpers/errorHandler';
import userFolderService from '@/services/userFolderService';
import { IGenericError } from '@/interfaces/errorInterface';
import { IJwtVerify } from '@/interfaces/jwtInterface';
import {
  IDeleteLinkBody,
  IEditFolderBody,
  IEditSubfolderBody,
  IEditSubfolderParams,
  IEditSubfolderRequest,
  ILink,
  ILinkFolderParams,
  ILinkSubfolderParams,
  IUserFolderResponse
} from '@/interfaces/userFolderInterface';

export const getFoldersByUserIdController = async (
  request: FastifyRequest<{
    Params: { userId: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;

    const response: IUserFolderResponse | IGenericError = await userFolderService.getFoldersByUserId(userId);

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
    Params: { userId: string },
    Body: { folderName: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { folderName } = request.body;

    const response: IUserFolderResponse | IGenericError = await userFolderService.createFolder(userId, folderName);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(204).send();
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao criar pasta',
      statusCode: 500
    };

    errorHandler(errorMessage, request, reply);
  }

};
export const createLinkController = async (
  request: FastifyRequest<{
    Params: ILinkFolderParams,
    Body: ILink
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId, folderId } = request.params;
    const link = request.body;
    const token = request.cookies.token;

    if (!token) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const decodedToken: IJwtVerify = request.server.jwt.verify<IJwtVerify>(token);

    if (decodedToken._id !== userId) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const response: IUserFolderResponse | IGenericError = await userFolderService.createLink(userId, link, folderId);

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
    Params: ILinkSubfolderParams,
    Body: {
      subfolderName: string
    }
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId, folderId } = request.params;
    const { subfolderName } = request.body;

    const token = request.cookies.token;

    if (!token) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const decodedToken: IJwtVerify = request.server.jwt.verify<IJwtVerify>(token);

    if (decodedToken._id !== userId) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const response: IUserFolderResponse | IGenericError = await userFolderService.createSubfolder(userId, subfolderName, folderId);

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
    Params: ILinkSubfolderParams,
    Body: ILink
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId, folderId, subfolderName } = request.params;
    const link = request.body;
    const token = request.cookies.token;

    if (!token) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const decodedToken: IJwtVerify = request.server.jwt.verify<IJwtVerify>(token);

    if (decodedToken._id !== userId) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const response: { picture: string } | IGenericError = await userFolderService.createLinkSubfolder(userId, link, folderId, subfolderName);

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
    Params: { userId: string },
    Body: IDeleteLinkBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const token = request.cookies.token;

    if (!token) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const decodedToken: IJwtVerify = request.server.jwt.verify<IJwtVerify>(token);

    if (decodedToken._id !== userId) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const response: { delete: boolean } | IGenericError = await userFolderService.deleteLink(userId, request.body);

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
    Params: { userId: string },
    Body: IEditFolderBody
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { editFolderId, editFolderName } = request.body;

    const token = request.cookies.token;

    if (!token) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const decodedToken: IJwtVerify = request.server.jwt.verify<IJwtVerify>(token);

    if (decodedToken._id !== userId) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const response: { ok: true } | IGenericError = await userFolderService.editFolder(userId, editFolderId, editFolderName);

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
    Params: { userId: string },
    Body: { deleteFolderId: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { deleteFolderId } = request.body;
    const token = request.cookies.token;

    if (!token) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const decodedToken: IJwtVerify = request.server.jwt.verify<IJwtVerify>(token);

    if (decodedToken._id !== userId) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const response: { delete: boolean } | IGenericError = await userFolderService.deleteFolder(userId, deleteFolderId);

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
    const token = request.cookies.token;

    if (!token) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const decodedToken: IJwtVerify = request.server.jwt.verify<IJwtVerify>(token);

    if (decodedToken._id !== userId) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const editSubfolderRequest: IEditSubfolderRequest = {
      userId,
      editFolderId,
      editSubfolderName,
      editOldSubfolderName
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
