export class UnknownServiceException extends Error {
  constructor() {
    super(`unknown service been requested`)
  }
}
