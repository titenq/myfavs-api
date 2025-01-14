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
