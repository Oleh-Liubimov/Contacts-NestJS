import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards} from '@nestjs/common';
import {ContactsService} from "./contacts.service";
import {CreateContactResponse, GetAllContactsResponse, GetOneContactResponse} from "../types";
import {Request} from "express";
import {AuthService} from "../auth/auth.service";
import {CreateContactDto, getContactsDto} from "./dto";
import {AuthenticateGuard} from "../guards/authenticate.guard";


@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService, private readonly authService: AuthService) {}

     @Get('/')
     @UseGuards(AuthenticateGuard)
     async getAllContacts(@Body() dto:getContactsDto):Promise<GetAllContactsResponse>{
        try {
            const contacts = await this.contactsService.getAllContacts(dto);

            return {
                status:HttpStatus.OK,
                msg:"Contacts is successfully been found",
                data:{
                    data:contacts.contacts,
                    paginationData:contacts.paginationData
                }
            }
        }catch (err){
            console.log(err)
            throw  new HttpException("Error getting contacts", HttpStatus.NOT_FOUND);

        }
     }

    @Get(':id')
    @UseGuards(AuthenticateGuard)
    async  getContactById(@Param('id') contactId: string, @Req() req: Request): Promise<GetOneContactResponse> {
        try{
            const session = await  this.authService.getSession(parseInt(req.cookies.sessionId));

            const contact = await this.contactsService.getContactById(parseInt(contactId), session.userId)

            return {
                status: HttpStatus.OK,
                msg:`Successfully found a contact`,
                data:contact
            }
        } catch (err) {
            console.log(err)
            throw  new HttpException("Error getting contact", HttpStatus.NOT_FOUND);
        }
    }

    @Post('/')
    @UseGuards(AuthenticateGuard)
    async createContact(@Body() payload: CreateContactDto, @Req() req:Request):Promise<CreateContactResponse> {
        const userId = req.user.id;
        try {
            const contact = await this.contactsService.createContact(payload, userId);

            if(!contact){
                 new HttpException("Contact not found", HttpStatus.NOT_FOUND);
            }

            return {
                status:HttpStatus.OK,
                msg:`Successfully create a contact with id ${contact.id}`,
                data:contact
            }
        } catch (err) {
            throw  new HttpException('Error creating contact', HttpStatus.NOT_FOUND);
        }
    }
}
