export interface IAuthLoginBody {
  email: string;
  password: string;
}

export interface IAuthVerifyEmailQuery {
  email: string;
  token: string;
}
