export interface IJwtVerify {
  _id: string;
}

export interface IJwtParams {
  userId: string;
}

export interface IJwtError {
  code: 'FAST_JWT_EXPIRED' | string;
}
