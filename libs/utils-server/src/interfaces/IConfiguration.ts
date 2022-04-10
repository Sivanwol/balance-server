export interface ConfigurationMessage {
  key: string;
  value: any;
  global?: boolean;
  service?: string
}
export interface Configuration {
  items: ConfigurationMessage[]
}
