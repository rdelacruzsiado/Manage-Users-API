import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { JwtStrategy, LocalStrategy } from './utilities/passport-strategies';
import {
  AuthController,
  AuthenticatorProxyAdapter,
  UserManagerAdapter,
} from './adapters/drivers';
import { UserRepo, UserSchema } from '../database/schemas';
import { UserService } from './app/user.service';
import { ForControlAuthenticating, ForRepoQuerying } from './ports/drivens';
import {
  ControlAuthenticatorAdapter,
  RepoQuerierAdapter,
} from './adapters/drivens';
import { ForAuthenticating, ForManagingUser } from './ports/drivers';
import config from '../config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserRepo.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
        };
      },
    }),
  ],
  providers: [
    JwtStrategy,
    LocalStrategy,
    UserService,
    {
      provide: ForAuthenticating,
      useClass: AuthenticatorProxyAdapter,
    },
    {
      provide: ForRepoQuerying,
      useClass: RepoQuerierAdapter,
    },
    {
      provide: ForControlAuthenticating,
      useClass: ControlAuthenticatorAdapter,
    },
    {
      provide: ForManagingUser,
      useClass: UserManagerAdapter,
    },
  ],
  controllers: [AuthController],
  exports: [{ provide: ForManagingUser, useClass: UserManagerAdapter }],
})
export class UserModule {}
