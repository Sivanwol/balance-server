import { Service } from 'typedi';
import { DbService } from './db.service';

/***
 * ActivityType Ranges of numbers
 * User actions = 1000 - 2999
 *
 */
export enum ActivityType {
  UnknownAction =-1,
  Login=1000,
  LoginVerifyRequest,
  LoginVerify,
  Logout,
  ForgetPasswordRequest,
  ForgetPassword,
  ResetPassword,
  TwoAuthRequest,
  TwoAuthVerify,
  ViewUsers,
  ViewUserProfile,
  DisableTemporaryUser,
  DisableUser,
  EnabledUser,
}
@Service()
export class ActivityLogService {

  public async registerActivity(activityType: ActivityType ,ip: string ,userId?: string, message?: string, metaData?: any) {
    await DbService.getInstance().connection.activityLog.create({
      data: {
        userId,
        referalIp: ip,
        message,
        action: activityType,
        metaData
      }
    })
  }
}
