import { RegisterUserDto } from '@balancer/utils-server/dtos/users.dto';
import { User, UserProfile } from '@prisma/client';
import { v5 as uuidv5 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { EmailService, RolesService, PermissionsService, DbService, ActivityLogService, ActivityType } from './';
import { IpwareIpInfo } from '@fullerstack/nax-ipware/src/lib/ipware.model';
import { Container, Service } from 'typedi';
import { UserModel } from '../models/user.model';
import { UserNotFoundException } from '../exceptions/UserNotFoundException';
import { UserFoundException } from '../exceptions/UserFoundException';
import { logger } from '../utils/logger';
import { CacheKeys } from '../constraints/CacheKeys';

@Service()
export class
UsersService {

  readonly emailService = Container.get( EmailService ) as EmailService;
  readonly rolesService = Container.get( RolesService ) as RolesService;
  readonly permissionsService = Container.get( PermissionsService ) as PermissionsService;
  readonly activityLogService = Container.get( ActivityLogService ) as ActivityLogService;


  public async getUserModelById( userId: string ): Promise<User> {
    logger.info( "received service request => getUserModelById" )
    const locateUser = await DbService.getInstance().connection.user
      .findFirst( {
        where: {
          id: userId
        },
        include: {
          userProfile: true,
          access: true
        }
      } );
    if (!locateUser) throw new UserNotFoundException( userId );
    return locateUser
  }

  public async getUserModelByEmail( email: string ): Promise<User> {
    logger.info( "received service request => getUserModelByEmail" )
    const locateUser = await DbService.getInstance().connection.user
      .findFirst( {
        where: {
          email
        },
        include: {
          userProfile: true,
          access: true
        }
      } );
    if (!locateUser) throw new UserNotFoundException( email );
    return locateUser
  }

  public async getUsersModel(): Promise<User[]> {
    logger.info( "received service request => getUserModelByEmail" )
    const users = await DbService.getInstance().connection.user
      .findMany( {
        include: {
          userProfile: true,
          access: true
        }
      } );
    return users
  }

  public async findAllUser(): Promise<UserModel[]> {
    logger.info( "received service request => findAllUser" )
    const users = await DbService.getInstance().connection.user
      .findMany( {
        include: {
          userProfile: true,
          access: true
        }
      } );
    return users.map( u => UserModel.toModel( u, u?.userProfile as UserProfile ) );
  }

  public async findUserById( userId: string, notFilters?: boolean ): Promise<UserModel | null> {
    logger.info( "received service request => findUserById" )
    const cacheKey = CacheKeys.LocateUser( userId )
    let locateUser;
    if (!notFilters) {
      const status = await DbService.getInstance().HasCache( cacheKey )
      if (!status) {
        locateUser = await DbService.getInstance().connection.user
          .findFirst( {
            where: {
              id: userId,
              disabledAt: null,
              disabledForeverAt: null,
              NOT: {
                emailVerified: null
              }
            },
            include: {
              userProfile: true,
              access: true
            }
          } );
        if (!locateUser) return null;
        await DbService.getInstance().CacheResult<User>( cacheKey, locateUser );
      } else {
        locateUser = await DbService.getInstance().GetCacheQuery( cacheKey ) as User
      }
    } else {
      locateUser = await DbService.getInstance().connection.user
        .findFirst( {
          where: {
            id: userId
          },
          include: {
            userProfile: true,
            access: true
          }
        } );
      if (!locateUser) throw new UserNotFoundException( userId );
    }
    return UserModel.toModel( locateUser, locateUser.userProfile );
  }

  public async findUserByAuth0UserId( userId: string, notFilters?: boolean ): Promise<UserModel | null> {
    logger.info( "received service request => findUserById" )
    const cacheKey = CacheKeys.LocateUser( userId )
    let locateUser;
    if (!notFilters) {
      const status = await DbService.getInstance().HasCache( cacheKey )
      if (!status) {
        locateUser = await DbService.getInstance().connection.user
          .findFirst( {
            where: {
              id: userId,
              disabledAt: null,
              disabledForeverAt: null,
              NOT: {
                emailVerified: null
              }
            },
            include: {
              userProfile: true,
              access: true
            }
          } );
        if (!locateUser) return null;
        await DbService.getInstance().CacheResult<User>( cacheKey, locateUser );
      } else {
        locateUser = await DbService.getInstance().GetCacheQuery( cacheKey ) as User
      }
    } else {
      locateUser = await DbService.getInstance().connection.user
        .findFirst( {
          where: {
            id: userId
          },
          include: {
            userProfile: true,
            access: true
          }
        } );
      if (!locateUser) throw new UserNotFoundException( userId );
    }
    return UserModel.toModel( locateUser, locateUser.userProfile );
  }

  public async registerUser( registerUserDto: RegisterUserDto ): Promise<UserModel | null> {
    logger.info( "received service request => registerUser" )
    const locateUser = await this.findUserByEmail( registerUserDto.email, true )
    if (locateUser) throw new UserFoundException( locateUser.id )
    const hashedPassword = await bcrypt.hash( registerUserDto.password, 10 );
    const user = {
      email: registerUserDto.email,
      password: hashedPassword
    }
    const record = await DbService.getInstance().connection.user.create( {
      data: user
    } )
    const userId = record.id
    logger.info( `Created user with id: ${userId}` )
    return await this.findUserById( userId, true )
  }

  public async findUserByEmail( email: string, noFilters?: boolean ): Promise<UserModel | null> {
    logger.info( "received service request => findUserByEmail" )
    let locateUser;
    if (!noFilters) {
      locateUser = await DbService.getInstance().connection.user
        .findFirst( {
          where: {
            email: email,
            disabledAt: null,
            disabledForeverAt: null,
            NOT: {
              emailVerified: null
            }
          },
          include: {
            userProfile: true,
            access: true
          }
        } );
    } else {
      locateUser = await DbService.getInstance().connection.user
        .findFirst( {
          where: {
            email: email,
          },
          include: {
            userProfile: true,
            access: true
          }
        } );
    }
    if (!locateUser) return null;
    return UserModel.toModel( locateUser, locateUser.userProfile );
  }

}
