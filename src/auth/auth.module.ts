import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './utils/GithubStrategy';
import { UsersModule } from 'src/users/users.module';
import { SessionSerializer } from './utils/Serializer';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UsersModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, SessionSerializer],
})
export class AuthModule {}
