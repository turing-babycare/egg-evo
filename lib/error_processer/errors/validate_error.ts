import { ValidationError } from 'class-validator';

export default class ValidateError extends Error {
  public type = 'VALIDATE'
  public status = 400
  constructor(msg: string, public errors: ValidationError[]) {
    super(msg);
  }
}
