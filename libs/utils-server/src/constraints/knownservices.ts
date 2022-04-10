export const knownServices = [
  'Web-API-Gateway',
  'Backend',
  'ConfigService',
  'Users',
  'Communities',
  'Communities-Groups',
  'Payments'
]

export enum ServicesRoute {
  APIGateWay = 'Web-API-Gateway',
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
