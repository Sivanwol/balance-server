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

  public async login( userId: string, password: string ): Promise<UserModel> {

    logger.info( "received service request => login" )
    const findUser = await DbService.getInstance().connection
      .user.findFirst( {
        where: {
          id: userId
        },
        include: {
          userProfile: true
        }
      } )
    if (!findUser) throw new UserNotFoundException( userId );

    const isPasswordMatching: boolean = await bcrypt.compare( password, findUser.password );
    if (!isPasswordMatching) throw new UserPasswordNotMatchedException( userId );

    const user: UserModel = UserModel.toModel( findUser, (findUser?.userProfile || null) as UserProfile );
    const settings = await this.configService.GetServiceSettingsByKey( 'users_auth_settings' ) as any
    let hasNeedValidate = false;
    if (settings) {
      if (settings.revalidate_two_way_auth && user.verifiedAccessPeriodDiff >= settings.revalidate_two_way_auth_period){
        user.requiredValidatedLogin = true;
        hasNeedValidate = true;
      }
    }
    if (!hasNeedValidate) {
      user.access_token = this.createToken( userId )
    }
    return user;
  }

  public registerUser(user: RegisterUserDto) {
    return;
  }

  public createToken( userId: string ): TokenData {
    const dataStoredInToken: DataStoredInToken = {user_id: userId};
    const secretKey: string = process.env.SECRET as string;
    const expiresIn: number = 60 * parseInt( process.env.JWT_EXPIRE || '60' );
    return {
      expiresIn, token: jwt.sign( dataStoredInToken, secretKey, {
        issuer: process.env.ISSUER,
        audience: process.env.Audience,
        expiresIn
      } )
    };
  }
}

