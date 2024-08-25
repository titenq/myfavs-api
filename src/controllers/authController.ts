import { pbkdf2Sync } from 'node:crypto';

import { FastifyReply, FastifyRequest } from 'fastify';

import errorHandler from '../helpers/errorHandler';
import authService from '../services/authService';
import { IAuthLoginBody } from '../interfaces/authInterface';
import { IUserBody, IUserResponse, IUserResponseModified } from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';

export const authRegisterController = async (
  request: FastifyRequest<{ Body: IUserBody }>,
  reply: FastifyReply
) => {
  try {
    const { name, email, password } = request.body;

    const response: IUserResponseModified | IGenericError = await authService.createUser({
      name,
      email,
      password
    });

    if ('error' in response) {
      return errorHandler(response, request, reply);
    }

    reply.status(201).send(response);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'Erro ao criar usuário',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const authLoginController = async (
  request: FastifyRequest<{ Body: IAuthLoginBody }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body;

    const response: IUserResponse | IGenericError = await authService.login({ email, password });

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    const token = await reply.jwtSign({ _id: response._id, email: response.email });

    const userModified: IUserResponseModified = {
      _id: response._id,
      name: response.name,
      email: response.email,
      createdAt: response.createdAt
    };

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
