import { Context } from 'egg';
import { ClassType } from 'class-transformer/ClassTransformer';
import LogicError from '../../lib/error_processer/errors/logic_error';
import { UnauthorizedError } from 'koa-jwt2';
import validator from '../../lib/validator';

export interface JWTUserPayload {
  id: string;
}

export default {

  throwLogic(this: Context, msg: string, code?: number): never {
    throw new LogicError(msg, code);
  },

  throwUnauth(this: Context, msg: string): never {
    throw new UnauthorizedError(msg);
  },

  resp(this: Context, payload: any, code = 1000) {
    this.body = {
      code,
      data: payload,
    };
  },

  async validator<T>(this: Context, dto: ClassType<T>): Promise<T> {
    const obj = await validator(dto, Object.assign({}, this.query, this.params, this.request.body));
    return obj;
  },

  getUser(this: Context): JWTUserPayload {
    const payload = {
      id: this.state.user.id,
    };
    return payload;
  },
};
