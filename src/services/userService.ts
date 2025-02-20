import UserModel from '@/models/UserModel';
import { IUserResponse } from '@/interfaces/userInterface';

const userService = {
  getUserByEmail: async (email: string) => {
    try {
      const user: IUserResponse | null = await UserModel.findOne({ email }).select('+password');

      return user;
    } catch (error) {
      return null;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const user: IUserResponse | null = await UserModel.findOne({ _id: userId }).select('+password');

      return user;
    } catch (error) {
      return null;
    }
  },
};

export default userService;
