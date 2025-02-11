export interface IAuthLoginBody {
  email: string;
  password: string;
  recaptchaToken?: string | null;
}

export interface IAuthVerifyEmail {
  token: string;
}

export interface IDecodedToken {
  _id: string;
  iat: number;
  exp: number;
}

export interface IResendLinkBody {
  email: string;
}

export interface IResendLinkResponse {
  message: string;
}

export interface IResetPasswordBody {
  token: string;
  password: string;
}
