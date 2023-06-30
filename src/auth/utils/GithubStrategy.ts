import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';
import { AuthServiceProvider } from '../types';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type GithubEmailObject = {
  email: string;
  verified: boolean;
  primary: boolean;
  visibility: string;
};

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthService) private authService: AuthServiceProvider,
    private readonly httpService: HttpService,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { data } = await firstValueFrom(
      this.httpService.get<GithubEmailObject[]>(
        'https://api.github.com/user/emails',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    const emailObject = data.find((e) => e.primary === true);

    const user = await this.authService.validateUser({
      email: emailObject.email,
    });
    return user || null;
  }
}
