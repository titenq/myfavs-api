import UserModel from '../models/UserModel';
import { IUserBody, IUserResponse, IUserResponseModified } from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';

const userService = {
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
      }

      return errorMessage;
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      const user: IUserResponse | null = await UserModel.findOne({ email }).select('+password');

      return user;
    } catch (error) {
      return null;
    }
  },
};

export default userService;
