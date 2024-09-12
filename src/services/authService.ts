import { pbkdf2Sync, randomUUID } from 'node:crypto';

import userService from './userService';
import UserModel from '@/models/UserModel';
import {
  IEmailVerifiedResponse,
  IUserBody,
  IUserResponse,
  IUserResponseModified
} from '@/interfaces/userInterface';
import { IGenericError } from '@/interfaces/errorInterface';
import { IAuthLoginBody, IAuthVerifyEmailQuery } from '@/interfaces/authInterface';
import sendVerificationEmail from '@/helpers/sendVerificationEmail';
import siteOrigin from '@/helpers/siteOrigin';

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

      const emailVerificationToken = randomUUID();

      const verificationLink = `${siteOrigin}/verificar-email?email=${encodeURIComponent(user.email)}&token=${emailVerificationToken}`;

      sendVerificationEmail(user.email, verificationLink);
      
      const userCreated: IUserResponse = await UserModel.create({
        ...user,
        emailVerificationToken
      });

      const userModified: IUserResponseModified = {
        _id: userCreated._id,
        name: userCreated.name,
        email: userCreated.email,
        emailVerificationToken,
        createdAt: userCreated.createdAt
      };

      return userModified;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao criar usuário',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  login: async (loginData: IAuthLoginBody): Promise<IUserResponse | IGenericError> => {
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
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao fazer login',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  verifyEmail: async (verifyEmailData: IAuthVerifyEmailQuery): Promise<IEmailVerifiedResponse | IGenericError> => {
    try {
      const user = await UserModel.findOne({
        email: verifyEmailData.email,
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
        { $set: { isEmailVerified: true, emailVerificationToken: null } }
      ).exec();

      console.log(userVerified);

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
