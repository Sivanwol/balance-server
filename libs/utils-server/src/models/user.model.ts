import { User, UserProfile } from '@prisma/client';
import { TokenData } from './auth.model';
import moment from 'moment'

export class UserModel {
  id: string
  email: string
  emailVerified: Date | null
  verifiedAccessAt: Date | null
  verifiedAccessPeriodDiff: number
  requiredValidatedLogin: boolean
  access_token?: TokenData
  mobile: string | null
  mobileVerified: Date | null
  image: string | null
  profile: UserProfileModel
  disabledAt: Date | null
  createdAt: Date
  updatedAt: Date

  static toModel( user: User, userProfile?: UserProfile ): UserModel {
    const userProfileModel: UserProfileModel = {
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || ''
    }
    const userDisabledAt =  user.disabledForeverAt ? user.disabledForeverAt : user.disabledAt
    const verifiedAccessAt = moment(user.verifiedAccessAt)

    return {
      id: user.id,
      email: user.email as string,
      emailVerified: user.emailVerified,
      mobile: user.mobile,
      verifiedAccessAt: user.verifiedAccessAt,
      mobileVerified: user.mobileVerified,
      image: user.image,
      profile: userProfileModel,
      requiredValidatedLogin: false,
      verifiedAccessPeriodDiff: verifiedAccessAt.diff(moment(), 'days'),
      disabledAt: userDisabledAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

}

export interface UserProfileModel {
  firstName: string
  lastName: string
}
