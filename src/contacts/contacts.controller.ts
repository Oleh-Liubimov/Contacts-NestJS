import {Controller, Get, HttpException, HttpStatus, Param, Req} from '@nestjs/common';
import {ContactsService} from "./contacts.service";
import {Contact} from "@prisma/client";
import {GetAllContactsResponse, GetOneContactResponse} from "../types";
import {Request} from "express";
import {AuthService} from "../auth/auth.service";

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService, private readonly authService: AuthService) {}

    // @Get('/')
    // async getAllContacts():Promise<GetAllContactsResponse>{
    // }

    @Get(':id')
    async  getContactById(@Param('id') contactId: string, @Req() req: Request): Promise<GetOneContactResponse> {
        try{
            const session = await  this.authService.getSession(parseInt(req.cookies.sessionId));

            const contact = await this.contactsService.getContactById(parseInt(contactId), session.userId)


            return {
                status: HttpStatus.OK,
                msg:`Successfully found a contact`,
                data:contact
            }
        }catch (e) {
            throw  new HttpException("Error getting contact", HttpStatus.NOT_FOUND);
        }
    }
}
