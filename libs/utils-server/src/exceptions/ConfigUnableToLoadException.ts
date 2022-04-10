export class ConfigUnableToLoadException extends Error {
  constructor() {
    super(`No Config Found or able to load service is down`)
  }
}
