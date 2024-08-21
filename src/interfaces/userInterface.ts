import { Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  picture?: string | null;
}

export interface IUserResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  picture?: string | null;
  createdAt: Date;
}
