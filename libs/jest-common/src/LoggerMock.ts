jest.mock('@applib/utils-server/utils/logger' ,() => ({
  info: (msg)=> console.info(msg),
  error: (msg)=> console.error(msg)
}))

export const logger = {
  info: (msg)=> console.info(msg),
  error: (msg)=> console.error(msg)
}
