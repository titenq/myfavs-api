import { pbkdf2Sync } from 'node:crypto';

import UserModel from '../models/UserModel';
import { IUserBody, IUserResponse, IUserResponseModified } from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';
import userService from './userService';
import { IAuthLoginBody } from '../interfaces/authInterface';

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
      
      const userCreated: IUserResponse = await UserModel.create(user);

      const userModified: IUserResponseModified = {
        _id: userCreated._id,
        name: userCreated.name,
        email: userCreated.email,
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
