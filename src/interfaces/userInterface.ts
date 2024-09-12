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
  password: string;
  isEmailVerified?: boolean | null;
  emailVerificationToken?: string | null;
  createdAt: Date;
}

export interface IUserResponseModified {
  _id: Types.ObjectId;
  name: string;
  email: string;
  isEmailVerified?: boolean | null;
  emailVerificationToken?: string | null;
  createdAt: Date;
}

export type IEmailVerifiedResponse = Omit<IUserResponseModified, 'isEmailVerified' | 'emailVerificationToken'>;
