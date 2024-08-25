import { pbkdf2Sync } from 'node:crypto';

import { FastifyReply, FastifyRequest } from 'fastify';

import errorHandler from '../helpers/errorHandler';
import userService from '../services/userService';
import { IAuthLoginBody } from '../interfaces/authInterface';
import { IUserResponse, IUserResponseModified } from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';

/* export const authRegisterController = async (
  request: FastifyRequest<{ Body: IUser}>,
  reply: FastifyReply
) => {
  try {
    const { name, email, password } = request.body;

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
      statusCode: 400,
    };

    errorHandler(errorMessage, request, reply);
  }
}; */

export const authLoginController = async (
  request: FastifyRequest<{ Body: IAuthLoginBody }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body;

    const user: IUserResponse | null = await userService.getUserByEmail(email);

    if (!user) {
      const errorMessage = {
        error: true,
        message: 'Erro ao buscar usuário por e-mail',
        statusCode: 404,
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const [salt, storedHash] = user.password.split(':');
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    if (hash !== storedHash) {
      const errorMessage = {
        error: true,
        message: 'e-mail e/ou senha incorreta',
        statusCode: 401
      };

      errorHandler(errorMessage, request, reply);

      return;
    }

    const userModified: IUserResponseModified = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    const token = await reply.jwtSign({ _id: user._id, email: user.email });

    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PROD',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 dia
      })
      .status(200)
      .send(userModified);
  } catch (error) {
    const errorMessage = {
      error: true,
      message: 'Erro ao fazer login',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};
