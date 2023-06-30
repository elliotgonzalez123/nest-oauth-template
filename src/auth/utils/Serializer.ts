import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';
import { AuthServiceProvider } from '../types';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(AuthService) private authService: AuthServiceProvider) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: (err: Error, user: User) => void) {
    // console.log('PAYLOAD', payload);
    const user = await this.authService.findUser(payload.id);
    // add stuff to the session here
    const sessionUser = { ...user };

    return user ? done(null, sessionUser) : done(null, null);
  }
}
