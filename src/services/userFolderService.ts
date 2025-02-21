import { Types } from 'mongoose';

import takeScreenshot from '@/helpers/takeScreenshot';
import { IGenericError } from '@/interfaces/errorInterface';
import UserFolderModel from '@/models/UserFolderModel';
import {
  ICreateFolderRequest,
  ICreateFolderRoot,
  ICreateLinkRequest,
  ICreateLinkSubfolderRequest,
  ICreateLinkSubfolderResponse,
  ICreateSubfolderRequest,
  IDeleteFolderRequest,
  IDeleteLinkRequest,
  IDeleteSubfolderRequest,
  IEditFolderRequest,
  IEditSubfolderRequest,
  IFolder,
  IGetFoldersByUserIdParams,
  IGetPublicFoldersByUsernameParams,
  ILinkResponse,
  IUserFolderCreateRoot,
  IUserFolderResponse
} from '@/interfaces/userFolderInterface';
import { deleteFile, deleteMultipleFiles } from '@/helpers/bucketActions';
import createErrorMessage from '@/helpers/createErrorMessage';
import UserModel from '@/models/UserModel';

const { ObjectId } = Types;

const userFolderService = {
  getFoldersByUserId: async (getFoldersByUserId: IGetFoldersByUserIdParams): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const { userId } = getFoldersByUserId;
      const response: IUserFolderResponse | null = await UserFolderModel.findOne({ userId });

      if (response && response.folders) {
        response.folders.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (!response) {
        const errorMessage = createErrorMessage('userId não encontrado', 404);

        return errorMessage;
      }

      return response;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao buscar pastas do usuário');

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
        const errorMessage = createErrorMessage('userId não encontrado', 404);

        return errorMessage;
      }

      return response.toObject() as IUserFolderResponse;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao criar pasta favoritos');

      return errorMessage;
    }
  },

  createFolder: async (createFolder: ICreateFolderRequest): Promise<void | IGenericError> => {
    try {
      const { userId, folderName } = createFolder;
      const userFolders = await UserFolderModel.findOne({ userId });

      if (!userFolders) {
        const errorMessage = createErrorMessage('userId não encontrado', 404);

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
      const errorMessage = createErrorMessage('erro ao criar pasta', 400);

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
        const errorMessage = createErrorMessage('userId não encontrado', 404);

        return errorMessage;
      }

      const response = await userFolders.save();

      return response.toObject() as IUserFolderResponse;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao criar link');

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
        const errorMessage = createErrorMessage('userId não encontrado', 404);

        return errorMessage;
      }

      const response = await userFolders.save();

      return response.toObject() as IUserFolderResponse;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao criar subpasta', 400);

      return errorMessage;
    }
  },

  createLinkSubfolder: async (createLinkSubfolderRequest: ICreateLinkSubfolderRequest): Promise<ICreateLinkSubfolderResponse | IGenericError> => {
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
        const errorMessage = createErrorMessage('userId não encontrado', 404);

        return errorMessage;
      }

      await userFolders.save();

      const createLinkSubfolderResponse: ICreateLinkSubfolderResponse = {
        picture: screenshotPath
      };

      return createLinkSubfolderResponse;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao criar link', 400);

      return errorMessage;
    }
  },

  deleteLink: async (deleteLinkRequest: IDeleteLinkRequest): Promise<void | IGenericError> => {
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

      return;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao deletar link');

      return errorMessage;
    }
  },

  editFolder: async (editFolderRequest: IEditFolderRequest): Promise<void | IGenericError> => {
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
        const errorMessage = createErrorMessage('userId não encontrado', 404);

        return errorMessage;
      }

      return;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao editar pasta');

      return errorMessage;
    }
  },

  deleteFolder: async (deleteFolderRequest: IDeleteFolderRequest): Promise<void | IGenericError> => {
    try {
      const { userId, deleteFolderId } = deleteFolderRequest;
      const userFolder = await UserFolderModel.findOne({
        userId,
        'folders._id': deleteFolderId
      });

      if (!userFolder) {
        const errorMessage = createErrorMessage('Pasta não encontrada', 404);

        return errorMessage;
      }

      const folder = userFolder.folders.find(f => f._id?.toString() === deleteFolderId) as IFolder;

      const allLinks = [
        ...(folder.links || []),
        ...(folder.subfolders?.flatMap(subfolder => subfolder.links || []) || [])
      ];

      const deleteResult = await deleteMultipleFiles(allLinks);
      if (deleteResult !== true) {
        return deleteResult;
      }

      await UserFolderModel.updateOne(
        { userId },
        { $pull: { folders: { _id: deleteFolderId } } }
      );

      return;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao deletar pasta');

      return errorMessage;
    }
  },

  editSubfolder: async (editSubfolderRequest: IEditSubfolderRequest): Promise<void | IGenericError> => {
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
        const errorMessage = createErrorMessage('userId não encontrado', 404);

        return errorMessage;
      }

      return;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao editar subpasta');

      return errorMessage;
    }
  },

  deleteSubfolder: async (deleteSubfolderRequest: IDeleteSubfolderRequest): Promise<void | IGenericError> => {
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
        const errorMessage = createErrorMessage('Subpasta não encontrada', 404);

        return errorMessage;
      }

      const folder = userFolder.folders.find(f => f._id?.toString() === deleteFolderId) as IFolder;
      const subfolder = folder.subfolders?.find(s => s.name === deleteSubfolderName);

      if (!subfolder) {
        const errorMessage = createErrorMessage('Subpasta não encontrada', 404);

        return errorMessage;
      }

      const deleteResult = await deleteMultipleFiles(subfolder.links || []);

      if (deleteResult !== true) {
        return deleteResult;
      }

      await UserFolderModel.updateOne(
        { userId, 'folders._id': deleteFolderId },
        { $pull: { 'folders.$.subfolders': { name: deleteSubfolderName } } }
      );

      return;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao deletar subpasta');

      return errorMessage;
    }
  },

  getLinks: async (): Promise<ILinkResponse[] | IGenericError> => {
    try {
      const links = await UserFolderModel.aggregate([
        { $unwind: "$folders" },
        {
          $facet: {
            folderLinks: [
              { $unwind: "$folders.links" },
              { $match: { "folders.links.isPrivate": false } },
              {
                $project: {
                  userId: "$userId",
                  url: "$folders.links.url",
                  picture: "$folders.links.picture",
                  description: "$folders.links.description",
                  isPrivate: "$folders.links.isPrivate"
                }
              }
            ],
            subfolderLinks: [
              { $unwind: "$folders.subfolders" },
              { $unwind: "$folders.subfolders.links" },
              { $match: { "folders.subfolders.links.isPrivate": false } },
              {
                $project: {
                  userId: "$userId",
                  url: "$folders.subfolders.links.url",
                  picture: "$folders.subfolders.links.picture",
                  description: "$folders.subfolders.links.description",
                  isPrivate: "$folders.subfolders.links.isPrivate"
                }
              }
            ]
          }
        },
        {
          $project: {
            allLinks: { $concatArrays: ["$folderLinks", "$subfolderLinks"] }
          }
        },
        { $unwind: "$allLinks" },
        { $sample: { size: 12 } },
        { $replaceRoot: { newRoot: "$allLinks" } }
      ]);

      if (!links || links.length === 0) {
        const errorMessage = createErrorMessage('links não encontrados', 404);
        return errorMessage;
      }

      const linksWithUsernames = await Promise.all(
        links.map(async (link) => {
          const user = await UserModel.findById(link.userId);
          return {
            ...link,
            username: user?.name || ''
          };
        })
      );

      return linksWithUsernames;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao buscar links');
      return errorMessage;
    }
  },

  getPublicFoldersByUsername: async (publicUsername: IGetPublicFoldersByUsernameParams): Promise<IUserFolderResponse | IGenericError> => {
    try {
      const { username } = publicUsername;

      const user = await UserModel.findOne({ name: username });

      if (!user) {
        const errorMessage = createErrorMessage('usuário não encontrado', 404);

        return errorMessage;
      }

      const [response] = await UserFolderModel.aggregate([
        { $match: { userId: user._id.toString() } },
        {
          $project: {
            userId: 1,
            folders: {
              $map: {
                input: "$folders",
                as: "folder",
                in: {
                  _id: "$$folder._id",
                  name: "$$folder.name",
                  links: {
                    $filter: {
                      input: "$$folder.links",
                      as: "link",
                      cond: { $eq: ["$$link.isPrivate", false] }
                    }
                  },
                  subfolders: {
                    $map: {
                      input: "$$folder.subfolders",
                      as: "subfolder",
                      in: {
                        _id: "$$subfolder._id",
                        name: "$$subfolder.name",
                        links: {
                          $filter: {
                            input: "$$subfolder.links",
                            as: "link",
                            cond: { $eq: ["$$link.isPrivate", false] }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ]);

      if (response && response.folders) {
        response.folders.sort((a: IFolder, b: IFolder): number => a.name.localeCompare(b.name));
      }

      if (!response) {
        const errorMessage = createErrorMessage('userId não encontrado', 404);

        return errorMessage;
      }

      return response;
    } catch (error) {
      const errorMessage = createErrorMessage('erro ao buscar pastas do usuário');

      return errorMessage;
    }
  },
};

export default userFolderService;
