import { FastifyRequest, FastifyReply } from 'fastify';

import errorHandler from '@/helpers/errorHandler';
import { IGenericError } from '@/interfaces/errorInterface';
import userFolderService from '@/services/userFolderService';
import { ILink, IUserFolderResponse } from '@/interfaces/userFolderInterface';

export const getFoldersByUserIdController = async (
  request: FastifyRequest<{ Params: { userId: string } }>,
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
  request: FastifyRequest<{ Params: { userId: string }, Body: { folderName: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { folderName } = request.body;
    
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

    const decodedToken = request.server.jwt.verify<{ _id: string; }>(token);

    if (decodedToken._id !== userId) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'não autorizado',
        statusCode: 403
      };

      errorHandler(errorMessage, request, reply);
      return;
    }
    
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
  request: FastifyRequest<{ Params: { userId: string, folderId: string }, Body: ILink }>,
  reply: FastifyReply
) => {
  try {
    const { userId, folderId } = request.params;
    const link = request.body;

    link.isPrivate = String(link.isPrivate) === 'true';
    
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

    const decodedToken = request.server.jwt.verify<{ _id: string; }>(token);

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
      statusCode: 500
    };

    errorHandler(errorMessage, request, reply);
  }
};
