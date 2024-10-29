import { Session, User } from '@prisma/client';

export interface SignUpResponse {
  status: number;
  msg: string;
  data: User;
}

export interface SignInResponse {
  status: number;
  msg: string;
  data: {
    accessToken: string;
  };
}