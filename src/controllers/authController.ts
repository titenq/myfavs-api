import { FastifyReply, FastifyRequest } from 'fastify';

import errorHandler from '../helpers/errorHandler';
import userService from '../services/userService';
import { IUser } from '../interfaces/userInterface';

export const authRegisterController = async (
  request: FastifyRequest<{ Body: IUser}>,
  reply: FastifyReply
) => {
  try {
    const { name, email, picture } = request.body;

    const userExists = await userService.getUserByEmail(email);

    if (userExists) {
      const errorMessage = {
        error: true,
        message: 'E-mail já cadastrado',
        statusCode: 409,
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const user = await userService.createUser({
      name,
      email,
      picture
    });

    reply.status(200).send(user);
  } catch (error) {
    const errorMessage = {
      error: true,
      message: 'Erro ao criar usuário',
      statusCode: 500,
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const authLoginController = async (
  request: FastifyRequest<{ Params: { email: string } }>,
  reply: FastifyReply
) => {
  try {
    const { email } = request.params;

    const user = await userService.getUserByEmail(email);

    if (!user) {
      const errorMessage = {
        error: true,
        message: 'Erro ao buscar usuário por e-mail',
        statusCode: 404,
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    reply.status(200).send(user);
  } catch (error) {
    const errorMessage = {
      error: true,
      message: 'Erro ao buscar usuário por e-mail',
      statusCode: 500,
    };

    errorHandler(errorMessage, request, reply);
  }
};
