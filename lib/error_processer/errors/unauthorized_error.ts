export default class UnauthorizedError extends Error {
  public type = 'UNAUTHORIZED'
  public status = 401
}
