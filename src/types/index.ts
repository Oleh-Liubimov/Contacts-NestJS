import { HttpException } from '@nestjs/common';
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

export interface PaginationData {
  totalPages:number,
  count:number,
  page:number,
  perPage:number,
  hasNextPage:boolean,
  hasPrevPage:boolean,
}

interface ResponsePagination{
  data:Contact[],
  paginationData:PaginationData,
}

export interface GetAllContactsResponse {
  status: number;
  msg: string;
  data: ResponsePagination
}
export interface GetOneContactResponse {
  status: number;
  msg: string;
  data: Contact | HttpException;
}

export interface CreateContactResponse {
  status: number;
  msg: string;
  data: Contact;
}
