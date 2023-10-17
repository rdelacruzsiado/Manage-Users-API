import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthenticatedUser } from '../../app/models';
import { LoggingDto, RegisterDto } from '../../app/dtos';
import { ForAuthenticating } from '../../ports/drivers';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly forAuthenticating: ForAuthenticating) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoggingDto })
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request, @Res() res: Response) {
    const { token, refreshToken, ...user } = req.user as AuthenticatedUser;

    res
      .cookie('token', token)
      .cookie('refreshToken', refreshToken)
      .json({ success: true, user });
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() userData: RegisterDto) {
    const { password, ...user } = userData;
    return await this.forAuthenticating.register(user, password);
  }
}
