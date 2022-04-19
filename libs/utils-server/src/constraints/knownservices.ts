export const knownServices = [
  'Web-API-Gateway',
  'Backend',
  'ConfigService',
  'SSO-server',
  'Users',
  'Communities',
  'Communities-Groups',
  'Payments'
]

export enum PlatformStatus {
  Online=200,
  Maintenance=300
}
export enum ServicesRoute {
  APIGateWay = 'Web-API-Gateway',
  SSO = "SSO-server",
  Backend = "Backend",
  Users = "Users",
  Communities = "Communities",
  ConfigService = "ConfigService",
  CommunitiesGroups = "Communities-Groups",
  Payments = "Payments",
}
export const SharedServicesEvents = [
  'ping',
  'pong',
  'sync_config'
]
