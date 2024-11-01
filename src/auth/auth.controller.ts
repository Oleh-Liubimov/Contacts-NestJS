import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Request, Response } from 'express';
import constants from 'src/constants';
import { SignInResponse, SignUpResponse } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto): Promise<SignUpResponse> {
    try {
      const user = await this.authService.signupUser(dto);
      delete  user.password;

      return {
        status: HttpStatus.CREATED,
        msg: 'Successfully registered a user',
        data: user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async signIn(
    @Body() userCredentials: SignInDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const session = await this.authService.signInUser(userCredentials);

      res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + constants.ONE_DAY),
      });
      res.cookie('sessionId', session.id, {
        httpOnly: true,
        expires: new Date(Date.now() + constants.ONE_DAY),
      });

      res.json({
        status: HttpStatus.OK,
        msg: 'Successfully signed in',
        data: {
          accessToken: session.accessToken,
        },
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {

    if (req.cookies.sessionId) {
      await this.authService.logoutUser(parseInt(req.cookies.sessionId));
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  }
}
