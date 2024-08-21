import UserModel from '../models/UserModel';
import { IUser, IUserResponse } from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';

const userService = {
  createUser: async (user: IUser) => {
    try {
      const userCreated: IUserResponse = await UserModel.create(user);

      return userCreated;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao criar usuário',
        statusCode: 400
      }

      return errorMessage;
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      const user: IUserResponse | null = await UserModel.findOne({ email });

      return user;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao buscar usuário por e-mail',
        statusCode: 404
      }

      return errorMessage;
    }
  },
};

export default userService;
