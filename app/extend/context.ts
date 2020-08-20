import { Context } from 'egg';
import LogicError from '../../lib/error_processer/errors/logic_error';
import UnauthorizedError from '../../lib/error_processer/errors/unauthorized_error';
import validator from '../../lib/validator';
import { ClassType } from 'class-transformer/ClassTransformer';

export interface JWTUserPayload {
  id?: string;
  _id?: string;
}

export interface PageOptions {
  total: number;
  pageSize: number;
  page: number;
}

export interface ResponseBody {
  code: number;
  data: any | ResponseBodyPayloadWithPage;
}

export interface ResponseBodyPayloadWithPage {
  [k: string]: any;
  page: PageOptions;
}

export default {

  throwLogic(this: Context, msg: string, code?: number): never {
    throw new LogicError(msg, code);
  },

  throwUnAuth(this: Context, msg: string): never {
    throw new UnauthorizedError(msg);
  },
  // TODO: 重载类型标注
  resp(this: Context, payload: any, page?: PageOptions, code = 1000): void {
    const respBody: ResponseBody = { code, data: null };
    if (page) {
      respBody.data = {
        page,
      };
      if (payload instanceof Array) {
        respBody.data.list = payload;
      } else if (typeof payload === 'object') {
        for (const k in payload) {
          respBody.data[k] = payload[k];
        }
      } else {
        throw new Error('response payload "with page" format error');
      }
    } else {
      respBody.data = payload;
    }
    this.body = respBody;
  },
  
  success(this: Context, data: any, message = 'SUCCESS', code = 20000) {
    this.body = {
      code, // 20000 是后台自定义的code 代表数据返回
      data,
      message,
    };
  },

  async validator<T>(this: Context, dto: ClassType<T>): Promise<T> {
    const payload = Object.assign({}, this.query, this.params, this.request.body);
    const parseToInt = [ 'page', 'pageSize' ];

    parseToInt.forEach(p => {
      if (payload[p]) {
        payload[p] = parseInt(payload[p]);
      }
    });

    const obj = await validator(dto, payload);
    return obj;
  },

  getUser(this: Context): JWTUserPayload {
    const payload = {
      id: this.state.user.id,
      _id: this.state.user?.data?._id
    };
    return payload;
  },
};
