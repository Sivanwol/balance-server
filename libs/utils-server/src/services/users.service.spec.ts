import { GenerateUser, GenerateUserSelect, UserMock } from '@wolberg-pro-games/jest-common/mocks/user.mock';
import { UsersService } from '@wolberg-pro-games/utils-server/services/users.service';
import { checkUserDbModel, checkUserEntity, checkUserModel } from '@wolberg-pro-games/jest-common/checks/user.checks';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '@wolberg-pro-games/jest-common/PrismaMock';
import { logger } from '@wolberg-pro-games/jest-common/LoggerMock';
import "@wolberg-pro-games/jest-common/SendGridMock"
import 'reflect-metadata';
import * as faker from 'faker';
import { Ipware } from '@fullerstack/nax-ipware';
import { UserNotFoundException } from '@wolberg-pro-games/utils-server/exceptions/UserNotFoundException';
import { ActivityType } from '@wolberg-pro-games/utils-server/services/activityLog.service';
import bcrypt from 'bcrypt';

describe( 'User Service Testing', () => {
  let ipInfo
  let userData: UserMock
  let currentUserPassword
  let usersService = new UsersService()
  beforeAll( () => {
    const ipware = new Ipware();
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '177.139.22.20, 177.139.233.21, 177.139.233.22, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    ipInfo = ipware.getClientIP( request );
  } )
  beforeEach( async () => {
    mockReset( prismaMock )
    userData = await GenerateUser( {userProfile: true} )
    currentUserPassword = userData.userPassword
    delete userData.userPassword
    prismaMock.user.create.mockResolvedValue( GenerateUserSelect( userData ) )
    const userCreated = await prismaMock.user.create( {
      data: {
        password: userData.password,
        emailVerified: userData.emailVerified,
        email: userData.email,
        mobile: userData.mobile,
        mobileVerified: userData.mobileVerified
      },
    } )
    await checkUserEntity( userData, userCreated, {userProfile: true} )
  } )
  describe( 'basic user actions', () => {

    it( 'Action -> get user Object by id case with correct user id user will be found', async () => {
      prismaMock.user.findFirst.mockResolvedValue( GenerateUserSelect( userData ) )
      const user = await usersService.getUserModelById( userData.id )
      await checkUserDbModel( userData, user );
    } )

    it( 'Action -> get user Object by id case with not correct user id user will be not found', async () => {
      prismaMock.user.findFirst.mockResolvedValue( null )
      const uid = faker.datatype.uuid()
      const error = new UserNotFoundException( uid )
      try {
        await usersService.getUserModelById( uid )
      } catch (e) {
        expect( e.message ).toEqual( error.message )
      }
    } )

    it( 'Action -> get user Object by email case with correct user id user will be found', async () => {
      prismaMock.user.findFirst.mockResolvedValue( GenerateUserSelect( userData ) )
      const user = await usersService.getUserModelByEmail( userData.email )
      await checkUserDbModel( userData, user );
    } )

    it( 'Action -> get user Object by id case with not correct user email user will be not found', async () => {
      prismaMock.user.findFirst.mockResolvedValue( null )
      const email = faker.internet.email()
      const error = new UserNotFoundException( email )
      try {
        await usersService.getUserModelByEmail( email )
      } catch (e) {
        expect( e.message ).toEqual( error.message )
      }
    } )
    it( 'Action -> get list of users', async () => {
      const listOfUsers = [
        await GenerateUser( {userProfile: true} ),
        await GenerateUser( {userProfile: true} ),
        await GenerateUser( {userProfile: true} )
      ]
      for (const u of listOfUsers) {
        prismaMock.user.create.mockResolvedValue( GenerateUserSelect( u ) )
        const userCreated = await prismaMock.user.create( {
          data: {
            password: userData.password,
            emailVerified: userData.emailVerified,
            email: userData.email,
            mobile: userData.mobile,
            mobileVerified: userData.mobileVerified
          },
        } )
      }

      prismaMock.user.findMany.mockResolvedValue( listOfUsers.map( u => GenerateUserSelect( u ) ) )
      const listOfUserProcess = await usersService.findAllUser()
      expect( listOfUserProcess.length ).toEqual( listOfUsers.length )

      for (const user of listOfUsers) {
        const index = listOfUsers.indexOf( user );
        await checkUserModel( user, listOfUserProcess[index] );
      }
    } )

    it( 'Action -> get user by id case with correct user id user will be found', async () => {
      prismaMock.user.findFirst.mockResolvedValue( GenerateUserSelect( userData ) )
      const user = await usersService.findUserById( userData.id )
      await checkUserModel( userData, user );
    } )

    it( 'Action -> get user by id case with not correct user id user will be not found', async () => {
      prismaMock.user.findFirst.mockResolvedValue( null )
      const user = await usersService.findUserById( faker.datatype.uuid() )
      expect( user ).toBeNull();
    } )

    it( 'Action -> get user by email case with correct user id user will be found', async () => {
      prismaMock.user.findFirst.mockResolvedValue( GenerateUserSelect( userData ) )
      const user = await usersService.findUserByEmail( userData.email )
      await checkUserModel( userData, user );
    } )

    it( 'Action -> get user by email case with not correct user id user will be not found', async () => {
      // usersService.findUserById()
      prismaMock.user.findFirst.mockResolvedValue( null )
      const user = await usersService.findUserByEmail( faker.internet.email() )
      expect( user ).toBeNull();
    } )

    it( 'Action -> reset user password', async () => {
      prismaMock.user.findFirst.mockResolvedValue( GenerateUserSelect( userData ) )
      const newUserPassword = faker.internet.password( 12 );
      const newUserHashing = await bcrypt.hash( newUserPassword, 10 )
      const newUserData = Object.assign({} , userData);
      newUserData.password = newUserHashing
      prismaMock.user.update.mockResolvedValue( GenerateUserSelect(newUserData) );
      const updateDate = faker.date.recent()
      const entityId = faker.datatype.uuid();
      prismaMock.activityLog.create.mockReturnValue( {
        id: entityId,
        action: ActivityType.ResetPassword,
        referalIp: ipInfo.ip,
        message: 'user reset password',
        userId: userData.id,
        metaData: null,
        createdAt: updateDate,
        updatedAt: updateDate
      } as any )
      const user = await usersService.getUserModelById( userData.id )
      await usersService.resetUserPassword(userData.id, newUserPassword , currentUserPassword , ipInfo)
      let isMatched = await bcrypt.compare( newUserPassword, user.password );
      expect(isMatched).toBeFalsy();
      expect(user.password).not.toEqual(newUserData.password)
      isMatched = await bcrypt.compare( newUserPassword, newUserData.password );
      expect(isMatched).toBeTruthy();
    } )
  } )
} )
