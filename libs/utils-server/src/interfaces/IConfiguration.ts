import { PlatformServices } from "@prisma/client";

export interface ConfigurationMessage {
  key: string;
  value: any;
  service: PlatformServices;
  isClient: boolean;
  isSecureClient: boolean;
}
export interface Configuration {
  items: ConfigurationMessage[]
}
