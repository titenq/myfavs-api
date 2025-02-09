import { FastifyRequest, FastifyReply } from 'fastify';

import userService from '@/services/userService';
import errorHandler from '@/helpers/errorHandler';
import createErrorMessage from '@/helpers/createErrorMessage';

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
