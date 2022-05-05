import { User } from '@prisma/client';

export class UserModel {
  id: string
  email: string
  emailVerified: boolean | null
  mobile: string | null
  mobileVerified?: boolean | null
  disabledAt: Date | null
  createdAt: Date
  updatedAt: Date

  static toModel( user: User ): UserModel {
    return {
      id: user.id,
      email: user.email as string,
      emailVerified: user.emailVerified,
      mobile: user.mobile,
      mobileVerified: user.mobileVerified,
      disabledAt: user.disabledAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

}
