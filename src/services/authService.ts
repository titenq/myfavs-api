import { pbkdf2Sync, randomUUID } from 'node:crypto';

import { Resend } from 'resend';

import UserModel from '../models/UserModel';
import { IUserBody, IUserResponse, IUserResponseModified } from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';
import userService from './userService';
import { IAuthLoginBody } from '../interfaces/authInterface';
import apiBaseUrl from '../helpers/apiBaseUrl';

const { EMAIL_API_KEY } = process.env;

const authService = {
  createUser: async (user: IUserBody) => {
    try {
      const userExists = await userService.getUserByEmail(user.email);

      if (userExists) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'E-mail já cadastrado',
          statusCode: 409
        };

        return errorMessage;
      }

      const emailVerificationToken = randomUUID();

      const verificationLink = `${apiBaseUrl}/verify-email?token=${emailVerificationToken}`;

      const resend = new Resend(EMAIL_API_KEY);

      const email = await resend.emails.send({
        from: 'titenq@gmail.com',
        to: user.email,
        subject: 'myfavs - Confirme seu e-mail',
        replyTo: 'titenq@gmail.com',
        html: `<p>Por favor, clique no link abaixo para confirmar seu e-mail:</p>
<a href="${verificationLink}">Confirmar E-mail</a>`
      });

      console.log(email);
      console.log(EMAIL_API_KEY);
      console.log(user.email);
      
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
        message: 'Erro ao criar usuário',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  login: async (loginData: IAuthLoginBody): Promise<IUserResponse | IGenericError> => {
    try {
      const { email, password } = loginData;

      const user = await userService.getUserByEmail(email);

      if (!user) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'Erro ao buscar usuário por e-mail',
          statusCode: 404
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
        message: 'Erro ao fazer login',
        statusCode: 400
      };

      return errorMessage;
    }
  },
};

export default authService;
