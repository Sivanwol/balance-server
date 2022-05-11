import { User } from '@prisma/client';

export class UserModel {
  id: string
  email: string
  mobile: string | null
  createdAt: Date
  updatedAt: Date

  static toModel( user: User ): UserModel {
    return {
      id: user.id,
      email: user.email as string,
      mobile: user.mobile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

}
