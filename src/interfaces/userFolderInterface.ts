import { Types } from 'mongoose';

export interface ILink {
  url: string;
  picture?: string | null;
  description?: string | null;
  isPrivate: boolean;
}

interface IUserId {
  userId: string;
}

export interface IGetFoldersByUserIdParams extends IUserId { }

export interface IGetFoldersByUserIdRequest extends IGetFoldersByUserIdParams { }

export interface ICreateFolderRoot extends IUserId { }

export interface ICreateFolderParams extends IUserId { }

export interface ICreateFolderBody {
  folderName: string;
}

export interface ICreateFolderRequest extends ICreateFolderParams, ICreateFolderBody { }

export interface ICreateLinkParams {
  userId: string;
  folderId: string;
}

export interface ICreateLinkBody extends ILink { }

export interface ICreateLinkRequest extends ICreateLinkParams {
  link: ILink;
}

export interface ICreateSubfolderParams {
  userId: string;
  folderId: string;
}

export interface ICreateSubfolderBody {
  subfolderName: string;
}

export interface ICreateSubfolderRequest extends ICreateSubfolderParams, ICreateSubfolderBody { }

export interface ICreateLinkSubfolderBody extends ILink { }

export interface ICreateLinkSubfolderParams extends ICreateSubfolderParams, ICreateSubfolderBody { }

export interface ICreateLinkSubfolderRequest extends ICreateLinkSubfolderParams {
  link: ILink;
}

export interface ICreateLinkSubfolderResponse {
  picture: string;
}

export interface IDeleteLinkParams extends IUserId { }

export interface IDeleteLinkBody {
  folderId: string | null;
  subfolderName: string | null;
  linkUrl: string;
  linkPicture: string | null;
}

export interface IDeleteLinkRequest extends IDeleteLinkParams {
  deleteLink: IDeleteLinkBody;
}

export interface IEditFolderParams extends IUserId { }

export interface IEditFolderBody {
  editFolderId: string;
  editFolderName: string;
}

export interface IEditFolderRequest extends IEditFolderParams, IEditFolderBody { }

export interface IDeleteFolderParams extends IUserId { }

export interface IDeleteFolderBody {
  deleteFolderId: string;
}

export interface IDeleteFolderRequest extends IDeleteFolderParams, IDeleteFolderBody { }

export interface IEditSubfolderParams {
  userId: string;
  editOldSubfolderName: string;
}

export interface IEditSubfolderBody {
  editFolderId: string;
  editSubfolderName: string;
}

export interface IEditSubfolderRequest extends IEditSubfolderParams, IEditSubfolderBody { }

export interface IFolder {
  name: string;
  links?: ILink[] | null;
  subfolders?: IFolder[] | null;
}

export interface IUserFolder {
  userId: string;
  folders: IFolder[];
  createdAt: Date;
}

export type IUserFolderCreateRoot = Omit<IUserFolder, 'createdAt'>;

export interface IUserFolderResponse extends IUserFolder {
  _id: Types.ObjectId;
}

export interface IDeleteSubfolderParams extends IUserId { }

export interface IDeleteSubfolderBody {
  deleteFolderId: string;
  deleteSubfolderName: string;
}

export interface IDeleteSubfolderRequest extends IDeleteSubfolderParams, IDeleteSubfolderBody { }
