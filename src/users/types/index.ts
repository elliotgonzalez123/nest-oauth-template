import { User } from '../entities/user.entity';

export interface UserServiceToAuthServiceProvider {
  createOauthUser(email: string): Promise<User>;
  findOne(id: string): Promise<User>;
  findOneByEmail(email: string): Promise<User>;
}
