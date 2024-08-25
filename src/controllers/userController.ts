import { FastifyRequest, FastifyReply } from 'fastify';

import userService from '../services/userService';
import errorHandler from '../helpers/errorHandler';
import { IUser, IUserResponse } from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';

export const createUserController = async (
  request: FastifyRequest<{ Body: IUser }>,
  reply: FastifyReply
) => {
  try {
    const { name, email } = request.body;

    const response: IUserResponse | IGenericError = await userService.createUser({
      name,
      email
    });

    if ('error' in response) {
      return errorHandler(response, request, reply);
    }

    reply.status(201).send(response);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'Erro ao criar usuário',
      statusCode: 500
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const getUserByEmailController = async (
  request: FastifyRequest<{ Params: { email: string } }>,
  reply: FastifyReply
) => {
  try {
    const { email } = request.params;

    const user = await userService.getUserByEmail(email);

    if (!user) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao buscar usuário por e-mail',
        statusCode: 404,
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    reply.status(200).send(user);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'Erro ao buscar usuário por e-mail',
      statusCode: 500,
    };

    errorHandler(errorMessage, request, reply);
  }
};
