export const knownServices = [
  'Web-API-Gateway',
  'ConfigService',
  'SSO-server',
]

export enum PlatformStatus {
  Online=200,
  Maintenance=300
}

export enum ServicesRoute {
  APIGateWay = 'Web-API-Gateway',
  SSO = "SSO-server",
  ConfigService = "ConfigService",
}

export const SharedServicesEvents = [
  'ping',
  'pong',
  'sync_config'
]
