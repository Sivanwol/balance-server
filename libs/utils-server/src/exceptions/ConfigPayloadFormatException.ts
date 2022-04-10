export class ConfigPayloadFormatException extends Error {
  constructor(content: string) {
    super(`Config Payload format not correct ${content}`)
  }
}
