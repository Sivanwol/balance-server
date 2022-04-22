import { User } from '@prisma/client';

export class UserModel {
  id: string
  email: string
  emailVerified: Date | null
  mobile: string | null
  mobileVerified: Date | null
  disabledAt: Date | null
  createdAt: Date
  updatedAt: Date

  static toModel( user: User ): UserModel {
    const userDisabledAt =  user.disabledForeverAt ? user.disabledForeverAt : user.disabledAt

    return {
      id: user.id,
      email: user.email as string,
      emailVerified: user.emailVerified,
      mobile: user.mobile,
      mobileVerified: user.mobileVerified,
      disabledAt: userDisabledAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

}
