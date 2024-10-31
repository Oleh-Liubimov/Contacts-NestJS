import { PrismaService } from 'prisma.service';
import { CreateContactDto, getContactsDto } from './dto';
import { calcPaginationData } from '../utils';
import {Contact} from "@prisma/client";


export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async getAllContacts(payload: getContactsDto) {
    const { perPage, page, sortOrder, sortBy, userId, filter } = payload;

    const limit:number = perPage;
    const skip:number = (page - 1) * perPage;

    const contactsQuery: any = this.prisma.contacts.findMany({
      where: {
        userId,
        ...(filter.contactType && {
          contactType: filter.contactType,
        }),
        ...(filter.isFavorite && { isFavorite: filter.isFavorite }),
      },
    });

    const [contactsCount, contacts] = await Promise.all([
      this.prisma.contacts.count({
        where: contactsQuery,
      }),
      this.prisma.contacts.findMany({
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

  async getContactById(contactId: number, userId: number):Promise<Contact> {
    return  this.prisma.contacts.findUnique({
      where: {
        userId: userId,
        id: contactId,
      },
    });
  }

  async createContact(payload: CreateContactDto, userId: number):Promise<Contact> {
    return  this.prisma.contacts.create({
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
    return this.prisma.contacts.delete({
      where:{
        id:contactId,
        userId
      }
    })
  }
}
