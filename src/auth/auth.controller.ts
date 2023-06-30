import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { GithubAuthGuard } from './utils/Guards';
import { Request, Response } from 'express';
import { AuthenticationGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  @Get('github/login')
  @UseGuards(GithubAuthGuard)
  handleGithubLogin() {
    return { msg: 'github Auth' };
  }

  @Get('github/redirect')
  @UseGuards(GithubAuthGuard)
  handleGithubRedirect(@Res() response: Response) {
    return response.redirect(process.env.APP_CLIENT_URL);
  }

  @Get('status')
  @UseGuards(AuthenticationGuard)
  getAuthStatus(@Req() request: Request) {
    // console.log('SESSION', req.user);
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }

  @Get('session')
  @UseGuards(AuthenticationGuard)
  getSession(@Req() request: Request) {
    return request.user;
  }

  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const logoutError = await new Promise((resolve) =>
      request.logOut({ keepSessionInfo: false }, (error) => resolve(error)),
    );

    if (logoutError) {
      console.error(logoutError);
      throw new InternalServerErrorException('Could not log out user');
    }

    return response.redirect(process.env.APP_CLIENT_URL);
  }

  @Get('protected')
  @UseGuards(AuthenticationGuard)
  test() {
    return { message: 'This is a protected route!' };
  }
}
