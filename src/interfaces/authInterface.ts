export interface IXRecaptchaToken {
  'x-recaptcha-token': string;
}

export interface IAuthLoginBody {
  email: string;
  password: string;
}

export interface IAuthLoginHeaders extends IXRecaptchaToken { }

export interface IAuthLoginService extends IAuthLoginBody {
  recaptchaToken: string;
}

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

export interface IAuthForgotPasswordService extends IAuthForgotPasswordBody {
  recaptchaToken: string;
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

