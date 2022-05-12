
import { User } from '@prisma/client';
import {
  EmailService,
  DbService,
  ActivityLogService,
} from './';
import { Container, Service } from 'typedi';
import { UserModel } from '../models/user.model';
import { UserNotFoundException } from '../exceptions/UserNotFoundException';
import { logger } from '../utils/logger';
import { CacheKeys } from '../constraints/CacheKeys';
import { RegisterUserAuth0Dto } from '../dtos/users.dto';

@Service()
export class UsersService {
  readonly emailService = Container.get(EmailService) as EmailService;
  readonly activityLogService = Container.get(
    ActivityLogService
  ) as ActivityLogService;

  public async getUserModelById(userId: string): Promise<User> {
    logger.info('received service request => getUserModelById');
    const locateUser = await DbService.getInstance().connection.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!locateUser) throw new UserNotFoundException(userId);
    return locateUser;
  }

  public async getUserModelByEmail(email: string): Promise<User> {
    logger.info('received service request => getUserModelByEmail');
    const locateUser = await DbService.getInstance().connection.user.findFirst({
      where: {
        email,
      },
    });
    if (!locateUser) throw new UserNotFoundException(email);
    return locateUser;
  }

  public async findAllUser(
    returnModels: boolean
  ): Promise<UserModel[] | User[]> {
    logger.info('received service request => findAllUser');
    const users = await DbService.getInstance().connection.user.findMany();
    return returnModels ? users.map((u) => UserModel.toModel(u)) : users;
  }

  public async findUserById(
    userId: string,
    notFilters?: boolean
  ): Promise<UserModel | null> {
    logger.info('received service request => findUserById');
    const cacheKey = CacheKeys.LocateUser(userId);
    let locateUser;
    if (!notFilters) {
      const status = await DbService.getInstance().HasCache(cacheKey);
      if (!status) {
        locateUser = await DbService.getInstance().connection.user.findFirst({
          where: {
            id: userId
          },
        });
        if (!locateUser) return null;
        await DbService.getInstance().CacheResult<User>(cacheKey, locateUser);
      } else {
        locateUser = (await DbService.getInstance().GetCacheQuery(
          cacheKey
        )) as User;
      }
    } else {
      locateUser = await DbService.getInstance().connection.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!locateUser) throw new UserNotFoundException(userId);
    }
    return UserModel.toModel(locateUser);
  }

  public async findUserByAuth0UserId(
    userId: string,
    notFilters?: boolean
  ): Promise<UserModel | null> {
    logger.info('received service request => findUserById');
    const cacheKey = CacheKeys.LocateUser(userId);
    let locateUser;
    if (!notFilters) {
      const status = await DbService.getInstance().HasCache(cacheKey);
      if (!status) {
        locateUser = await DbService.getInstance().connection.user.findFirst({
          where: {
            authUserId: userId,
          },
        });
        if (!locateUser) return null;
        await DbService.getInstance().CacheResult<User>(cacheKey, locateUser);
      } else {
        locateUser = (await DbService.getInstance().GetCacheQuery(
          cacheKey
        )) as User;
      }
    } else {
      locateUser = await DbService.getInstance().connection.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!locateUser) throw new UserNotFoundException(userId);
    }
    return UserModel.toModel(locateUser);
  }

  public async registerUser(
    userId: string,
    registerUserDto: RegisterUserAuth0Dto
  ): Promise<UserModel | null> {
    logger.info('received service request => registerUser');
    const locateUser = await this.findUserByEmail(registerUserDto.email, true);
    let record;
    const user = {
      authUserId: userId,
      email: registerUserDto.email,
      fullName: registerUserDto.fullName || '',
      username: registerUserDto.userName,
      displayName: registerUserDto.displayName  || ''
    };
    if (!locateUser) {
      record = await DbService.getInstance().connection.user.create({
        data: user,
      });
    }
    const localUserId = record?.id || locateUser?.id;
    logger.info(`Created user with id: ${localUserId}`);
    return await this.findUserById(localUserId, true);
  }

  public async findUserByEmail(
    email: string,
    noFilters?: boolean
  ): Promise<UserModel | null> {
    logger.info('received service request => findUserByEmail');
    let locateUser;
    if (!noFilters) {
      locateUser = await DbService.getInstance().connection.user.findFirst({
        where: {
          email: email
        },
      });
    } else {
      locateUser = await DbService.getInstance().connection.user.findFirst({
        where: {
          email: email,
        },
      });
    }
    if (!locateUser) return null;
    return UserModel.toModel(locateUser);
  }
}
