import { Types } from 'mongoose';

import takeScreenshot from '@/helpers/takeScreenshot';
import { IGenericError } from '@/interfaces/errorInterface';
import UserFolderModel from '@/models/UserFolderModel';
import {
  ICreateFolderRequest,
  ICreateFolderRoot,
  ICreateLinkRequest,
  ICreateLinkSubfolderRequest,
  ICreateSubfolderRequest,
  IDeleteFolderRequest,
  IDeleteLinkBody,
  IDeleteLinkRequest,
  IDeleteSubfolderRequest,
  IEditFolderRequest,
  IEditSubfolderRequest,
  IFolder,
  IGetFoldersByUserIdParams,
  IUserFolderCreateRoot,
  IUserFolderResponse
} from '@/interfaces/userFolderInterface';
import { deleteFile, deleteMultipleFiles } from '@/helpers/bucketActions';

const { ObjectId } = Types;

const userFolderService = {
  getFoldersByUserId: async (getFoldersByUserId: IGetFoldersByUserIdParams): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const { userId } = getFoldersByUserId;
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
  
  createFolderRoot: async (createFolderRoot: ICreateFolderRoot): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const { userId } = createFolderRoot;
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

  createFolder: async (createFolder: ICreateFolderRequest): Promise<void | IGenericError> => {
    try {
      const { userId, folderName } = createFolder;
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

  createLink: async (createLinkRequest: ICreateLinkRequest): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const { userId, link, folderId } = createLinkRequest;
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

  createSubfolder: async (createSubfolderRequest: ICreateSubfolderRequest): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const { userId, folderId, subfolderName } = createSubfolderRequest;
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

  createLinkSubfolder: async (createLinkSubfolderRequest: ICreateLinkSubfolderRequest): Promise<{ picture: string } | IGenericError> => {
    try {
      const { userId, link, folderId, subfolderName } = createLinkSubfolderRequest;
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

  deleteLink: async (deleteLinkRequest: IDeleteLinkRequest): Promise<{ delete: true} | IGenericError> => {
    try {
      const { userId, deleteLink } = deleteLinkRequest;
      const { folderId, linkUrl, subfolderName, linkPicture } = deleteLink;

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

  editFolder: async (editFolderRequest: IEditFolderRequest): Promise<{ ok: true } | IGenericError> => {
    try {
      const { userId, editFolderId, editFolderName } = editFolderRequest;
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

  deleteFolder: async (deleteFolderRequest: IDeleteFolderRequest): Promise<{ delete: true } | IGenericError> => {
    try {
      const { userId, deleteFolderId } = deleteFolderRequest;
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
      
      const allLinks = [
        ...(folder.links || []),
        ...(folder.subfolders?.flatMap(subfolder => subfolder.links || []) || [])
      ];

      const deleteResult = await deleteMultipleFiles(allLinks);
      if (deleteResult !== true) return deleteResult;

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

  deleteSubfolder: async (deleteSubfolderRequest: IDeleteSubfolderRequest): Promise<{ delete: true } | IGenericError> => {
    try {
      const {
        userId,
        deleteFolderId,
        deleteSubfolderName
      } = deleteSubfolderRequest;

      const userFolder = await UserFolderModel.findOne({
        userId,
        'folders._id': deleteFolderId
      });

      if (!userFolder) {
        return {
          error: true,
          message: 'Subpasta não encontrada',
          statusCode: 404
        };
      }

      const folder = userFolder.folders.find(f => f._id?.toString() === deleteFolderId) as IFolder;
      const subfolder = folder.subfolders?.find(s => s.name === deleteSubfolderName);

      if (!subfolder) {
        return {
          error: true,
          message: 'Subpasta não encontrada',
          statusCode: 404
        };
      }

      const deleteResult = await deleteMultipleFiles(subfolder.links || []);

      if (deleteResult !== true) {
        return deleteResult;
      }

      await UserFolderModel.updateOne(
        { userId, 'folders._id': deleteFolderId },
        { $pull: { 'folders.$.subfolders': { name: deleteSubfolderName } } }
      );

      return { delete: true };
    } catch (error) {
      return {
        error: true,
        message: 'erro ao deletar subpasta',
        statusCode: 400
      };
    }
  }};

export default userFolderService;
