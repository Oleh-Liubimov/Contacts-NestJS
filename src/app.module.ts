import {Global, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContactsModule } from './contacts/contacts.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'prisma.service';
import {ContactsController} from "./contacts/contacts.controller";
import {LoggingMiddleware} from "./middleware/logging.middleware";


@Global()
@Module({
  imports: [AuthModule, ContactsModule, ConfigModule.forRoot()],
  controllers: [AppController, AuthController, ContactsController],
  providers: [AppService, AuthService, PrismaService],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
