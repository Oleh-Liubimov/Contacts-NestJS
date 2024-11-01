import { PrismaService } from 'prisma.service';
import { CreateContactDto, getContactsDto } from './dto';
import { calcPaginationData } from '../utils';
import { Contact } from '@prisma/client';
import {HttpException, HttpStatus} from "@nestjs/common";


export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async getAllContacts(payload: getContactsDto) {
    const { perPage, page, sortOrder, sortBy, userId, filter } = payload;

    const limit:number = perPage;
    const skip:number = (page - 1) * perPage;

    const contactsQuery: any = this.prisma.contact.findMany({
      where: {
        userId,
        ...(filter.contactType && {
          contactType: filter.contactType,
        }),
        ...(filter.isFavorite && { isFavorite: filter.isFavorite }),
      },
    });

    const [contactsCount, contacts] = await Promise.all([
      this.prisma.contact.count({
        where: contactsQuery,
      }),
      this.prisma.contact.findMany({
        where: contactsQuery,
        take: limit,
        skip,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
    ]);

    const paginationData = calcPaginationData(contactsCount, page, perPage);

    return {
      data: contacts,
      paginationData,
    };
  }

  async getContactById(contactId: number, userId: number):Promise<Contact | HttpException> {
    const contact = await this.prisma.contact.findUnique({
      where: {
        userId: userId,
        id: contactId,
      },
    });
    if(!contact) {
      throw new HttpException("Contact not found", HttpStatus.NOT_FOUND);
    }
    return contact
  }

  async createContact(payload: CreateContactDto, userId: number):Promise<Contact> {
    return  this.prisma.contact.create({
      data: {
        ...payload,
        user:{
          connect:{
            id:userId
          }
        }
      },
    });
  };


  async  deleteContact(contactId: number, userId:number):Promise<Contact> {
    return this.prisma.contact.delete({
      where:{
        id:contactId,
        userId
      }
    })
  }
}
