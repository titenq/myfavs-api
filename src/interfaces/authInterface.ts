export interface IAuthLoginBody {
  email: string;
  password: string;
}

export interface IAuthVerifyEmail {
  token: string;
}

export interface IDecodedToken {
  _id: string;
  iat: number;
  exp: number;
}
