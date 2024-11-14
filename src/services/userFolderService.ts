import { IGenericError } from '@/interfaces/errorInterface';
import { IUserFolderCreateRoot, IUserFolderResponse } from '@/interfaces/userFolderInterface';
import UserFolderModel from '@/models/UserFolderModel';

const userFolderService = {
  getFoldersByUserId: async (userId: string): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const response: IUserFolderResponse | null = await UserFolderModel
        .findOne({ userId })
        .lean();
      
      if (response && response.folders) {
        response.folders.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (!response) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'userId não encontrado',
          statusCode: 404
        };

        return errorMessage;
      }

      return response;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao buscar pastas do usuário',
        statusCode: 400
      };

      return errorMessage;
    }
  },
  
  createFolderRoot: async (userId: string): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const rootFolder: IUserFolderCreateRoot = {
        userId,
        folders: [
          {
            name: 'favoritos',
            links: [],
            subfolders: []
          }
        ]
      };
  
      const response = await UserFolderModel.create(rootFolder);

      if (!response) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'userId não encontrado',
          statusCode: 404
        };

        return errorMessage;
      }

      return response.toObject() as IUserFolderResponse;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao criar pasta favoritos',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  createFolder: async (userId: string, folderName: string): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const userFolders = await UserFolderModel.findOne({ userId });

      if (!userFolders) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'userId não encontrado',
          statusCode: 404
        };

        return errorMessage;
      }

      userFolders.folders.push({
        name: folderName,
        links: [],
        subfolders: []
      });

      const response = await userFolders.save();

      return response.toObject() as IUserFolderResponse;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao criar pasta',
        statusCode: 400
      };

      return errorMessage;
    }
  }};

export default userFolderService;
