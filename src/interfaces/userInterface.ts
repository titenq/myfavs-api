import { Types } from 'mongoose';

export interface IUserBody {
  name: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string
  createdAt: Date;
}

export interface IUserResponseModified {
  _id: Types.ObjectId;
  name: string;
  email: string;
  createdAt: Date;
}
