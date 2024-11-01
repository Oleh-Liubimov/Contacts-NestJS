import { Contact, User } from '@prisma/client';

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

export interface GetAllContactsResponse {
  status:number;
  msg: string;
  data: Contact[];
}
export interface GetOneContactResponse {
  status:number;
  msg: string;
  data: Contact | null;
}
