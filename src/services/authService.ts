import { pbkdf2Sync } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import userService from './userService';
import UserModel from '@/models/UserModel';
import {
  IEmailVerifiedResponse,
  IUserBody,
  IUserResponse,
  IUserResponseModified
} from '@/interfaces/userInterface';
import { IGenericError } from '@/interfaces/errorInterface';
import {
  IAuthLoginBody,
  IAuthVerifyEmail,
  IDecodedToken
} from '@/interfaces/authInterface';

const authService = {
  createUser: async (user: IUserBody): Promise<IUserResponseModified | IGenericError> => {
    try {
      const userExists = await userService.getUserByEmail(user.email);

      if (userExists) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'e-mail já cadastrado',
          statusCode: 409
        };

        return errorMessage;
      }
      
      const userCreated: IUserResponse = await UserModel.create(user);

      return userCreated;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao criar usuário',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  login: async (fastify: FastifyInstance, loginData: IAuthLoginBody): Promise<IUserResponse | IGenericError> => {
    try {
      const { email, password } = loginData;

      const user: IUserResponse | null = await userService.getUserByEmail(email);

      if (!user) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'e-mail e/ou senha incorreta',
          statusCode: 404
        };

        return errorMessage;
      }

      if (user.emailVerificationToken) {
        await fastify.jwt.verify(user.emailVerificationToken) as IDecodedToken;
      }

      if (!user.isEmailVerified) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'usuário não verificou o e-mail',
          statusCode: 403
        };

        return errorMessage;
      }

      const [salt, storedHash] = user.password.split(':');
      const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

      if (hash !== storedHash) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'e-mail e/ou senha incorreta',
          statusCode: 401
        };

        return errorMessage;
      }

      return user;
    } catch (error) {
      if ((error as any).code === 'FAST_JWT_EXPIRED') {
        const errorMessage: IGenericError = {
          error: true,
          message: 'token expirado',
          statusCode: 401
        };

        return errorMessage;
      }
      
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao fazer login',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  verifyEmail: async (fastify: FastifyInstance, verifyEmailData: IAuthVerifyEmail): Promise<IEmailVerifiedResponse | IGenericError> => {
    try {
      const decoded = await fastify.jwt.verify(verifyEmailData.token) as IDecodedToken;

      const user = await UserModel.findOne({
        _id: decoded._id,
        emailVerificationToken: verifyEmailData.token
      });

      if (!user) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'erro ao verificar e-mail',
          statusCode: 400
        };

        return errorMessage;
      }

      const userVerified = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { isEmailVerified: true, emailVerificationToken: null } },
        { new: true }
      ).exec();

      if (!userVerified) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'erro ao verificar e-mail',
          statusCode: 400
        };

        return errorMessage;
      }

      const userVerifiedModified: IEmailVerifiedResponse = {
        _id: userVerified._id,
        name: userVerified.name,
        email: userVerified.email,
        createdAt: userVerified.createdAt
      };

      return userVerifiedModified;
    } catch (error) {
      if ((error as any).code === 'FAST_JWT_EXPIRED') {
        const errorMessage: IGenericError = {
          error: true,
          message: 'token expirado',
          statusCode: 401
        };

        return errorMessage;
      }

      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao verificar e-mail',
        statusCode: 400
      };

      return errorMessage;
    }
  },
};

export default authService;
