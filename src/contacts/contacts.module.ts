import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import {ContactsService} from "./contacts.service";
import {AuthService} from "../auth/auth.service";

@Module({
  controllers: [ContactsController],
  providers:[ContactsService,AuthService],
  exports: [ContactsService,AuthService],
})
export class ContactsModule {}
