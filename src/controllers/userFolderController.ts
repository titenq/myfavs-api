import { FastifyRequest, FastifyReply } from 'fastify';

import errorHandler from '@/helpers/errorHandler';
import { IGenericError } from '@/interfaces/errorInterface';
import userFolderService from '@/services/userFolderService';
import { IUserFolderResponse } from '@/interfaces/userFolderInterface';

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
  request: FastifyRequest<{ Params: { userId: string }, Body: { name: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { name } = request.body;
    
    const response: IUserFolderResponse | IGenericError = await userFolderService.createFolder(userId, name);

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(201).send(response);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao buscar usuário',
      statusCode: 500,
    };

    errorHandler(errorMessage, request, reply);
  }
};
