import fs from 'node:fs';
import path from 'node:path';

import { Types } from 'mongoose';

import takeScreenshot from '@/helpers/takeScreenshot';
import { IGenericError } from '@/interfaces/errorInterface';
import UserFolderModel from '@/models/UserFolderModel';
import {
  IDeleteLinkBody,
  IEditSubfolderRequest,
  IFolder,
  ILink,
  IUserFolderCreateRoot,
  IUserFolderResponse
} from '@/interfaces/userFolderInterface';
import { deleteFile } from '@/helpers/bucketActions';

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

  createFolder: async (userId: string, folderName: string): Promise<void | IGenericError> => {
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

      await userFolders.save();

      return;
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
        const deleteResult = await deleteFile(linkPicture);
        
        if (typeof deleteResult === 'object' && 'error' in deleteResult) {
          return deleteResult;
        }
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

  editFolder: async (userId: string, editFolderId: string, editFolderName: string): Promise<{ ok: true } | IGenericError> => {
    try {
      const userFolders = await UserFolderModel.findOneAndUpdate(
        {
          userId,
          'folders._id': editFolderId
        },
        {
          $set: {
            'folders.$.name': editFolderName
          }
        },
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

      return { ok: true };
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao editar pasta',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  deleteFolder: async (userId: string, deleteFolderId: string): Promise<{ delete: true } | IGenericError> => {
    try {
      const userFolder = await UserFolderModel.findOne({ 
        userId,
        'folders._id': deleteFolderId 
      });

      if (!userFolder) {
        return {
          error: true,
          message: 'Pasta não encontrada',
          statusCode: 404
        };
      }

      const folder = userFolder.folders.find(f => f._id?.toString() === deleteFolderId) as IFolder;

      if (folder && folder.links) {
        folder.links.forEach((link: ILink) => {
          if (link.picture) {
            const imagePath = path.join(process.cwd(), link.picture);

            fs.unlinkSync(imagePath);
          }
        });

        folder.subfolders?.forEach((subfolder: IFolder) => {
          subfolder.links?.forEach((link: ILink) => {
            if (link.picture) {
              const imagePath = path.join(process.cwd(), link.picture);

              fs.unlinkSync(imagePath);
            }
          });
        });
      }

      await UserFolderModel.updateOne(
        { userId },
        { $pull: { folders: { _id: deleteFolderId } } }
      );

      return { delete: true };
    } catch (error) {
      return {
        error: true,
        message: 'erro ao deletar pasta',
        statusCode: 400
      };
    }
  },

  editSubfolder: async (editSubfolderRequest: IEditSubfolderRequest): Promise<{ ok: true } | IGenericError> => {
    try {
      const {
        userId,
        editFolderId,
        editOldSubfolderName,
        editSubfolderName
      } = editSubfolderRequest;

      const userFolders = await UserFolderModel.findOneAndUpdate(
        {
          userId,
          'folders._id': editFolderId,
          'folders.subfolders.name': editOldSubfolderName
        },
        {
          $set: {
            'folders.$[folder].subfolders.$[subfolder].name': editSubfolderName
          }
        },
        {
          arrayFilters: [
            { 'folder._id': editFolderId },
            { 'subfolder.name': editOldSubfolderName }
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

      return { ok: true };
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'erro ao editar subpasta',
        statusCode: 400
      };

      return errorMessage;
    }
  },
};

export default userFolderService;
