import { IUserBody } from '@/interfaces/userInterface';

export interface IXRecaptchaToken {
  'x-recaptcha-token': string;
}

export interface IAuthRegisterBody extends IUserBody { }

export interface IAuthRegisterHeaders extends IXRecaptchaToken { }

export interface IAuthLoginBody {
  email: string;
  password: string;
}

export interface IAuthLoginHeaders extends IXRecaptchaToken { }

export interface IAuthVerifyEmail {
  token: string;
}

export interface IDecodedToken {
  _id: string;
  iat: number;
  exp: number;
}

export interface IAuthForgotPasswordBody {
  email: string;
}

export interface IAuthForgotPasswordHeaders extends IXRecaptchaToken { }

export interface IAuthForgotPasswordResponse {
  message: string;
}

export interface IResendLinkBody {
  email: string;
  recaptchaToken?: string | null;
}

export interface IResendLinkResponse {
  message: string;
}

export interface IResetPasswordBody {
  token: string;
  password: string;
}

