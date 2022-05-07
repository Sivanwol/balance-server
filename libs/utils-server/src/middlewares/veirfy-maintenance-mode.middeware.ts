
import { CacheKeys } from "../constraints/CacheKeys";
import RedisUtil from '../utils/redisUtil';

export const verifyMaintenanceMode =async (
  request: any,
  response: any,
  next?:  (err?: any) => any) => {
  try {
    const currentMaintenanceMode = await RedisUtil.get(
      CacheKeys.MaintenanceMode
    );
    if (currentMaintenanceMode !== '1') {
      next();
    } else {
      throw new Error('platform on maintenance mode');
    }
  } catch (err) {
    next(err);
  }
};
