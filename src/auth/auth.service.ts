import { Injectable, Inject } from '@nestjs/common';
import { UserServiceToAuthServiceProvider } from 'src/users/types';
import { AuthServiceProvider, UserDetails } from './types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService implements AuthServiceProvider {
  constructor(
    @Inject(UsersService)
    private usersService: UserServiceToAuthServiceProvider,
  ) {}

  //find or create oauth user
  async validateUser(details: UserDetails) {
    // console.log('Searching db for user...');
    const user = await this.usersService.findOneByEmail(details.email);
    if (!user) {
      //console.log('User not found creating user...');
      const newUser = await this.usersService.createOauthUser(details.email);
      return { ...newUser, role: 'Admin' };
    }
    // console.log('User found, returning user...');
    return { ...user, role: 'Admin' };
  }

  findUser(id: string) {
    return this.usersService.findOne(id);
  }

  test() {
    return 'test';
  }
}
