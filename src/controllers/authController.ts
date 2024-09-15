import { FastifyReply, FastifyRequest } from 'fastify';

import errorHandler from '@/helpers/errorHandler';
import authService from '@/services/authService';
import {
  IAuthLoginBody,
  IAuthVerifyEmail,
  IResendLinkBody,
  IResendLinkResponse
} from '@/interfaces/authInterface';
import {
  IEmailVerifiedResponse,
  IUserBody,
  IUserResponse,
  IUserResponseModified
} from '@/interfaces/userInterface';
import { IGenericError } from '@/interfaces/errorInterface';
import sendVerificationEmail from '@/helpers/sendVerificationEmail';
import siteOrigin from '@/helpers/siteOrigin';
import UserModel from '@/models/UserModel';

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

    const emailVerificationToken = await reply.jwtSign({ _id: response._id }, { expiresIn: '1d' });

    await UserModel.findByIdAndUpdate(
      { _id: response._id },
      { emailVerificationToken },
      { new: true }
    );

    const verificationLink = `${siteOrigin}/verificar-email?token=${emailVerificationToken}`;

    await sendVerificationEmail(response.email, verificationLink);

    const user: IUserResponseModified = {
      _id: response._id,
      name: response.name,
      email: response.email,
      createdAt: response.createdAt
    };

    reply.status(201).send(user);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao criar usuário',
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

    const response: IUserResponse | IGenericError = await authService.login(request.server, { email, password });

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    const token = await reply.jwtSign({ _id: response._id });

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
      message: 'erro ao fazer login',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const authLogoutController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    reply
      .clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PROD',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 dia
      })
      .status(200)
      .send({ message: 'logout realizado com sucesso' });
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao fazer logout',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const authVerifyEmailController = async (
  request: FastifyRequest<{ Body: IAuthVerifyEmail }>,
  reply: FastifyReply
) => {
  try {
    const { token } = request.body;

    const response: IEmailVerifiedResponse | IGenericError = await authService.verifyEmail(request.server, { token });

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(200).send(response);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao verificar e-mail',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export const authResendLinkController = async (
  request: FastifyRequest<{ Body: IResendLinkBody }>,
  reply: FastifyReply
) => {
  try {
    const { email } = request.body;

    const response: IResendLinkResponse | IGenericError = await authService.resendLink(request.server, { email });

    if ('error' in response) {
      errorHandler(response, request, reply);

      return;
    }

    reply.status(200).send(response);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao reenviar link de verificação',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};
