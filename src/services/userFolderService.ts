import fs from 'node:fs';
import path from 'node:path';

import { Types } from 'mongoose';

import takeScreenshot from '@/helpers/takeScreenshot';
import { IGenericError } from '@/interfaces/errorInterface';
import {
  IDeleteLinkBody,
  ILink,
  IUserFolderCreateRoot,
  IUserFolderResponse
} from '@/interfaces/userFolderInterface';
import UserFolderModel from '@/models/UserFolderModel';

const { ObjectId } = Types;

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
  },

  createLink: async (userId: string, link: ILink, folderId: string): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const screenshotPath = await takeScreenshot(link.url, new ObjectId().toString());

      if (typeof screenshotPath === 'object' && 'error' in screenshotPath) {
        return screenshotPath;
      }

      link.picture = screenshotPath;
      
      const userFolders = await UserFolderModel.findOneAndUpdate(
        { userId, 'folders._id': folderId },
        { $push: { 'folders.$.links': link } },
        { new: true }
      );

      if (!userFolders) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'userId não encontrado',
          statusCode: 404
        };

        return errorMessage;
      }

      const response = await userFolders.save();

      return response.toObject() as IUserFolderResponse;
    } catch (error) {
      console.log(error)
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao criar link',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  createSubfolder: async (userId: string, subfolderName: string, folderId: string): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const userFolders = await UserFolderModel.findOneAndUpdate(
        { userId, 'folders._id': folderId },
        { $push: { 'folders.$.subfolders': { name: subfolderName, links: [], subfolders: [] } } },
        { new: true }
      );

      if (!userFolders) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'userId não encontrado',
          statusCode: 404
        };

        return errorMessage;
      }

      const response = await userFolders.save();

      return response.toObject() as IUserFolderResponse;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao criar subpasta',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  createLinkSubfolder: async (userId: string, link: ILink, folderId: string, subfolderName: string): Promise<{ picture: string } | IGenericError> => {
    try {
      const screenshotPath = await takeScreenshot(link.url, new ObjectId().toString());

      if (typeof screenshotPath === 'object' && 'error' in screenshotPath) {
        return screenshotPath;
      }

      link.picture = screenshotPath;

      const userFolders = await UserFolderModel.findOneAndUpdate(
        {
          userId,
          'folders._id': folderId,
          'folders.subfolders.name': subfolderName
        },
        {
          $push: {
            'folders.$[folder].subfolders.$[subfolder].links': link
          }
        },
        {
          arrayFilters: [
            { 'folder._id': folderId },
            { 'subfolder.name': subfolderName }
          ],
          new: true
        }
      );

      if (!userFolders) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'userId não encontrado',
          statusCode: 404
        };

        return errorMessage;
      }

      await userFolders.save();

      return { picture: screenshotPath };
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao criar link',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  deleteLink: async (userId: string, deleteLinkBody: IDeleteLinkBody): Promise<{ delete: true} | IGenericError> => {
    try {
      const { folderId, subfolderName, linkUrl, linkPicture } = deleteLinkBody;

      if (linkPicture) {
        const imagePath = path.join(process.cwd(), linkPicture);

        fs.unlinkSync(imagePath);
      }

      if (!subfolderName) {
        await UserFolderModel.updateOne(
          { 
            userId,
            'folders._id': folderId
          },
          { 
            $pull: { 
              'folders.$.links': { url: linkUrl } 
            } 
          }
        );
      } else {
        await UserFolderModel.updateOne(
          { 
            userId,
            'folders._id': folderId,
            'folders.subfolders.name': subfolderName
          },
          { 
            $pull: { 
              'folders.$[folder].subfolders.$[subfolder].links': { url: linkUrl }
            }
          },
          {
            arrayFilters: [
              { 'folder._id': folderId },
              { 'subfolder.name': subfolderName }
            ]
          }
        );
      }

      return { delete: true };
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao deletar link',
        statusCode: 400
      };

      return errorMessage;
    }
  },
};

export default userFolderService;
