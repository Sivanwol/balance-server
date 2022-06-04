export class CacheKeys {
  static ServiceSettings = (serviceName: string) => `config:${serviceName}`
  static LocateUser = (userId) => `users:${userId}`
  static MaintenanceMode = 'platform_mode'
}
