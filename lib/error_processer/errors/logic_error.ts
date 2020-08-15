export default class LogicError extends Error {
  public type = 'LOGIC'
  public status = 400
  public errorCode = 400
  constructor(msg: string, code = 400) {
    super(msg);
    this.errorCode = code;
  }
}
