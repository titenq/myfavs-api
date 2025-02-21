import { FastifyRequest, FastifyReply } from 'fastify';

import userService from 'src/services/userService';
import errorHandler from 'src/helpers/errorHandler';
import createErrorMessage from 'src/helpers/createErrorMessage';

export const getUserByIdController = async (
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;

    const user = await userService.getUserById(userId);

    if (!user) {
      const errorMessage = createErrorMessage('erro ao buscar usuário por id', 404);

      errorHandler(errorMessage, request, reply);

      return;
    }

    reply.status(200).send(user);
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao buscar usuário por id');

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
      const errorMessage = createErrorMessage('erro ao buscar usuário por e-mail', 404);

      errorHandler(errorMessage, request, reply);

      return;
    }

    reply.status(200).send(user);
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao buscar usuário por e-mail');

    errorHandler(errorMessage, request, reply);
  }
};

export const getUsersController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await userService.getUsers();

    reply.status(200).send(users);
  } catch (error) {
    const errorMessage = createErrorMessage('erro ao buscar usuários');

    errorHandler(errorMessage, request, reply);
  }
};
