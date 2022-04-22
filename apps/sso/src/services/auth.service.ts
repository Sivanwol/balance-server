import { RegisterUserDto } from '@balancer/utils-server/dtos/users.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Container, Service } from 'typedi';
import { UserModel } from '@balancer/utils-server/models/user.model';
import { UserNotFoundException } from '@balancer/utils-server/exceptions/UserNotFoundException';
import { DataStoredInToken, TokenData } from '@balancer/utils-server/models/auth.model';
import { logger } from '@balancer/utils-server/utils/logger';
import { UserPasswordNotMatchedException } from '@balancer/utils-server/exceptions/UserPasswordNotMatchedException';
import { ConfigService, DbService, UsersService } from '@balancer/utils-server/services';
import { UserProfile } from '@prisma/client';

@Service()
export class AuthService {
  readonly configService = Container.get( ConfigService ) as ConfigService;
  readonly usersService = Container.get( UsersService ) as UsersService;

  public registerUser(user: RegisterUserDto) {
    return;
  }
}

