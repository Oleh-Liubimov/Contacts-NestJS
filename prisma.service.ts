import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
  private isConnected = false;

  async onModuleInit() {
    if(!this.isConnected){
      await this.$connect();
      this.isConnected = true;
      console.log('Connected to postgres');
    }
  }

  async onModuleDestroy(){
    if(this.isConnected){
      await this.$disconnect();
      this.isConnected = false;
      console.log('Disconnected from postgres');
    }
  }
}
