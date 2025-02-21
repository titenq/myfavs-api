import UserModel from 'src/models/UserModel';
import { IUserResponse, IUsersLinks } from 'src/interfaces/userInterface';
import { IGenericError } from 'src/interfaces/errorInterface';
import createErrorMessage from 'src/helpers/createErrorMessage';
import UserFolderModel from 'src/models/UserFolderModel';
import { ILink, IUserFolder } from 'src/interfaces/userFolderInterface';

interface ISubfolder {
  links?: ILink[];
}

interface IFolder {
  links?: ILink[];
  subfolders?: ISubfolder[];
}

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

  getUsers: async (): Promise<IUsersLinks[] | IGenericError> => {
    try {
      const users = await UserModel.find({}).select('_id name');

      const usersLinks = await Promise.all(
        users.map(async (user) => {
          const userFolder = await UserFolderModel.findOne({ userId: user._id }) as IUserFolder;

          let qtdLinks = 0;

          if (userFolder?.folders) {
            userFolder.folders.forEach(folder => {
              qtdLinks += folder.links?.filter(link => !link.isPrivate)?.length || 0;

              folder.subfolders?.forEach(subfolder => {
                qtdLinks += subfolder.links?.filter((link: ILink) => !link.isPrivate)?.length || 0;
              });
            });
          }

          return {
            name: user.name,
            qtdLinks
          };
        })
      );

      if (!usersLinks) {
        const errorMessage = createErrorMessage('usuários não encontrados', 404);

        return errorMessage;
      }

      return usersLinks;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao buscar usuários', 400);

      return errorMessage;
    }
  },
};

export default userService;
