import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import ValidateError from '../error_processer/errors/validate_error';

export default async <T>(dto: ClassType<T>, obj: object | object[]): Promise<T> => {
  const validatorObj = plainToClass(dto, obj, { excludeExtraneousValues: true });
  const errors = await validate(validatorObj);
  if (errors && errors.length > 0) {
    throw new ValidateError(errors[0].toString(), errors);
  }
  return validatorObj;
};
