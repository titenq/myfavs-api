import { pbkdf2Sync } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import userService from '../services/userService';
import UserModel from '../models/UserModel';
import {
  IEmailVerifiedResponse,
  IUserBody,
  IUserResponse,
  IUserResponseModified
} from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';
import {
  IAuthForgotPasswordBody,
  IAuthForgotPasswordResponse,
  IAuthLoginBody,
  IAuthVerifyEmail,
  IDecodedToken,
  IResendLinkBody,
  IResendLinkResponse,
  IResetPasswordBody
} from '../interfaces/authInterface';
import siteOrigin from '../helpers/siteOrigin';
import sendVerificationEmail from '../helpers/sendVerificationEmail';
import sendForgotPasswordEmail from '../helpers/sendForgotPasswordEmail';
import userFolderService from '../services/userFolderService';
import { IJwtError } from '../interfaces/jwtInterface';
import createErrorMessage from '../helpers/createErrorMessage';

const authService = {
  createUser: async (user: IUserBody): Promise<IUserResponseModified | IGenericError> => {
    try {
      const userExists = await userService.getUserByEmail(user.email);

      if (userExists) {
        const errorMessage = createErrorMessage('e-mail já cadastrado', 409);

        return errorMessage;
      }

      const userCreated: IUserResponse = await UserModel.create(user);

      await userFolderService.createFolderRoot({ userId: userCreated._id.toString() });

      return userCreated;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao criar usuário');

      return errorMessage;
    }
  },

  login: async (fastify: FastifyInstance, loginData: IAuthLoginBody): Promise<IUserResponse | IGenericError> => {
    try {
      const { email, password } = loginData;

      const user: IUserResponse | null = await userService.getUserByEmail(email);

      if (!user) {
        const errorMessage = createErrorMessage('e-mail e/ou senha incorreta', 404);

        return errorMessage;
      }

      if (user.emailVerificationToken) {
        await fastify.jwt.verify(user.emailVerificationToken) as IDecodedToken;
      }

      if (!user.isEmailVerified) {
        const errorMessage = createErrorMessage('usuário não verificou o e-mail', 403);

        return errorMessage;
      }

      const [salt, storedHash] = user.password.split(':');
      const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

      if (hash !== storedHash) {
        const errorMessage = createErrorMessage('e-mail e/ou senha incorreta', 401);

        return errorMessage;
      }

      return user;
    } catch (error) {
      if ((error as IJwtError).code === 'FAST_JWT_EXPIRED') {
        const errorMessage = createErrorMessage('token expirado', 401);

        return errorMessage;
      }

      const errorMessage = createErrorMessage('erro ao fazer login');

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
        const errorMessage = createErrorMessage('erro ao verificar e-mail');

        return errorMessage;
      }

      const userVerified = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { isEmailVerified: true, emailVerificationToken: null } },
        { new: true }
      ).exec();

      if (!userVerified) {
        const errorMessage = createErrorMessage('erro ao verificar e-mail');

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
      if ((error as IJwtError).code === 'FAST_JWT_EXPIRED') {
        const errorMessage = createErrorMessage('token expirado', 401);

        return errorMessage;
      }

      const errorMessage = createErrorMessage('erro ao verificar e-mail');

      return errorMessage;
    }
  },

  resendLink: async (fastify: FastifyInstance, resendLinkBody: IResendLinkBody): Promise<IResendLinkResponse | IGenericError> => {
    try {
      const { email } = resendLinkBody;

      const user = await UserModel.findOne({ email });

      if (!user) {
        const errorMessage = createErrorMessage('usuário não encontrado', 404);

        return errorMessage;
      }

      if (user.isEmailVerified) {
        const errorMessage = createErrorMessage('e-mail já verificado');

        return errorMessage;
      }

      const token = fastify.jwt.sign({ _id: user._id }, { expiresIn: '1d' });

      user.emailVerificationToken = token;
      await user.save();

      const verificationLink = `${siteOrigin}/verificar-email?token=${token}`;
      await sendVerificationEmail(user.email, verificationLink);

      const responseMessage: IResendLinkResponse = {
        message: 'novo link de verificação enviado para o e-mail',
      };

      return responseMessage;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao reenviar link de verificação');

      return errorMessage;
    }
  },

  forgotPassword: async (fastify: FastifyInstance, forgotPassword: IAuthForgotPasswordBody): Promise<IAuthForgotPasswordResponse | IGenericError> => {
    try {
      const { email } = forgotPassword;

      const user = await UserModel.findOne({ email });

      if (!user) {
        const errorMessage = createErrorMessage('usuário não encontrado', 404);

        return errorMessage;
      }

      const token = fastify.jwt.sign({ _id: user._id }, { expiresIn: '1d' });

      user.forgotPasswordToken = token;
      await user.save();

      const forgotPasswordLink = `${siteOrigin}/recadastrar-senha?token=${token}`;
      await sendForgotPasswordEmail(user.email, forgotPasswordLink);

      const responseMessage: IResendLinkResponse = {
        message: 'link para recadastrar senha enviado para o e-mail',
      };

      return responseMessage;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao enviar link para recadastrar senha');

      return errorMessage;
    }
  },

  resetPassword: async (fastify: FastifyInstance, resetPasswordBody: IResetPasswordBody): Promise<IResendLinkResponse | IGenericError> => {
    try {
      const { token, password } = resetPasswordBody;

      await fastify.jwt.verify(token) as IDecodedToken;

      const user = await UserModel.findOne({
        forgotPasswordToken: token
      });

      if (!user) {
        const errorMessage = createErrorMessage('token não encontrado', 404);

        return errorMessage;
      }

      user.password = password;
      user.forgotPasswordToken = null;

      await user.save();

      const responseMessage: IResendLinkResponse = {
        message: 'senha resetada com sucesso',
      };

      return responseMessage;
    } catch (error) {
      if ((error as IJwtError).code === 'FAST_JWT_EXPIRED') {
        const errorMessage = createErrorMessage('token expirado', 401);

        return errorMessage;
      }

      const errorMessage = createErrorMessage('erro ao resetar senha');

      return errorMessage;
    }
  }
};

export default authService;
