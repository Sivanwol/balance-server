export class CacheKeys {
  static GlobalSettings = 'config:Global'
  static ServiceSettings = (serviceName: string) => `config:${serviceName}`
  static LocateUser = (userId) => `users:${userId}`
  static MaintenanceMode = 'platform_mode'
}
