import * as bcrypt from 'bcrypt';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { SignUpDto, SignInDto } from './dto';
import { randomBytes } from 'crypto';
import constants from 'src/constants';
import { Session, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signupUser(payload: SignUpDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (user) {
      throw new HttpException(
        'User with that email already exist',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    return await this.prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });
  }

  async signinUser(payload: SignInDto): Promise<Session> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) {
      throw new HttpException(
        'Credential is incirrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await this.prisma.session.create({
      data: {
        userId: user.id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + constants.FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + constants.ONE_DAY),
      },
    });
  }

  async logoutUser(sessionId: number): Promise<void> {
    await this.prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  }
}
