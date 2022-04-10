export class CacheKeys {
  static GlobalSettings = 'GlobalConfig'
  static ServiceSettings = (serviceName: string) => `${serviceName}_config`
  static LocateUser = (userId) => `FindUser_${userId}`
}
