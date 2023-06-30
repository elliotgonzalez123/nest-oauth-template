import { User } from 'src/users/entities/user.entity';

export type UserDetails = {
  email: string;
};

export interface AuthServiceProvider {
  validateUser(details: UserDetails): Promise<User | undefined>;
  findUser(id: string): Promise<User | undefined>;
}
