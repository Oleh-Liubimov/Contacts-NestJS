import {
  Body,
  Controller,
  Delete,
  HttpCode,
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

  @Post('signin')
  async signin(
    @Body() dto: SignInDto,
    @Res() res: Response,
  ): Promise<SignInResponse> {
    try {
      const session = await this.authService.signinUser(dto);

      res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + constants.ONE_DAY),
      });
      res.cookie('sessionId', session.id, {
        httpOnly: true,
        expires: new Date(Date.now() + constants.ONE_DAY),
      });

      return {
        status: HttpStatus.OK,
        msg: 'Successfully signed in',
        data: {
          accessToken: session.accessToken,
        },
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

  @Delete('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    if (req.cookies.sessionId) {
      await this.authService.logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  }
}
