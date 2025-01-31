import { Types } from 'mongoose';

export interface ILink {
  url: string;
  picture?: string | null;
  description?: string | null;
  isPrivate: boolean;
}

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

export interface ILinkFolderParams {
  userId: string;
  folderId: string;
}

export interface ILinkSubfolderParams {
  userId: string;
  folderId: string;
  subfolderName: string;
}

export interface IDeleteLinkBody {
  folderId: string | null;
  subfolderName: string | null;
  linkId: string | null;
  linkUrl: string;
  linkPicture: string | null;
}

export interface IEditFolderBody {
  editFolderId: string;
  editFolderName: string;
}

export interface IEditSubfolderParams {
  userId: string;
  editOldSubfolderName: string;
}

export interface IEditSubfolderBody {
  editFolderId: string;
  editSubfolderName: string;
}
