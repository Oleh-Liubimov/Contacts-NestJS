import { ContactType } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class getContactsDto {
  page: number;
  perPage: number;
  sortOrder: SORT_ORDER;
  sortBy: string;
  filter: filterDto;
  userId: number;
}

enum SORT_ORDER {
  ASC = "asc",
  DESC = "desc",
}

interface filterDto {
  isFavorite?: boolean;
  contactType?: ContactType;
}

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  email?: string;

  @IsBoolean()
  isFavorite?: boolean;

  @IsEnum(ContactType)
  contactType: ContactType;

  @IsString()
  photoUrl?: string;
}
