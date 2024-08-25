import { Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string
  createdAt: Date;
}
