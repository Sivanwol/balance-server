import moment from 'moment';
import bcrypt from 'bcrypt';
import * as faker from 'faker';

export interface UserMock {
  id: string,
  email: string,
  emailVerified: Date,
  password: string,
  image?: string,
  mobileVerified?: Date,
  userPassword?: string
  disabledAt?: Date,
  disabledForeverAt?: Date,
  verifiedAccessMethod: 'Email' | 'SMS',
  verifiedAccessAt: Date,
  mobile: string,
  userProfile?: UserProfileMock
  createdAt: Date,
  updatedAt: Date,

}

export interface UserProfileMock {
  id: string,
  firstName: string,
  lastName: string,
  createdAt: Date,
  updatedAt: Date,
}

export type GenerateUserIncludeMock = {
  userProfile?: boolean
}
export const GenerateUserSelect = ( entity: UserMock ): any => ({
  id: entity.id,
  email: entity.email,
  emailVerified: entity.emailVerified,
  password: entity.password,
  verifiedAccessAt: entity.verifiedAccessAt,
  verifiedAccessMethod: entity.verifiedAccessMethod,
  mobile: entity.mobile,
  image: entity.image,
  disabledAt: entity.disabledAt,
  disabledForeverAt: entity.disabledForeverAt,
  userProfile: entity.userProfile,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt
})

export const GenerateUser = async ( userInclude?: GenerateUserIncludeMock ): Promise<UserMock> => {
  const userPassword = faker.internet.password( 12 )
  return {
    id: faker.datatype.uuid(),
    email: faker.internet.exampleEmail(),
    emailVerified: moment().subtract( 2, 'years' ).toDate(),
    password: await bcrypt.hash( userPassword, 10 ),
    verifiedAccessMethod: 'Email',
    verifiedAccessAt: moment().subtract( 2, 'years' ).toDate(),
    mobile: faker.phone.phoneNumber(),
    mobileVerified: moment().subtract( 1.5, 'years' ).toDate(),
    userPassword,
    userProfile: !userInclude?.userProfile ? undefined : {
      id: faker.datatype.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      createdAt: moment().subtract( 2, 'years' ).toDate(),
      updatedAt: moment().subtract( 2, 'years' ).toDate()
    },
    createdAt: moment().subtract( 2, 'years' ).toDate(),
    updatedAt: moment().subtract( 2, 'years' ).toDate()
  }
}
