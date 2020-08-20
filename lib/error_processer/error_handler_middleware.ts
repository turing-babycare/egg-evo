import { Context } from 'egg';
import LogicError from './errors/logic_error';
import { UnauthorizedError } from 'koa-jwt2';
import ValidateError from './errors/validate_error';
import { randomBytes } from 'crypto';

export const enum mode {
  dev = 'dev',
  prod = 'prod',
  stage = 'stage'
}


enum LoggerOptionsType {
  info = 'info',
  error = 'error',
}

enum LoggerMsgLabel {
  logic = 'REQUEST_LOGIC_EXCEPTION',
  unauthorized = 'REQUEST_UNAUTHORIZED_EXCEPTION',
  validate = 'REQUEST_VALIDATE_EXCEPTION',
  unhandled = 'REQUEST_UNHANDLED_EXCEPTION'
}

interface ILoggerOptions {
  type: LoggerOptionsType;
  label: LoggerMsgLabel;
}

export default function errorHandler() {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      await next();
      const execTime = Date.now() - ctx.starttime;
      if (execTime >= 200) {
        ctx.logger.warn('[SLOW_REQUEST] spend: %sms request: %s', execTime, JSON.stringify({
          url: ctx.request.url,
          method: ctx.request.method,
          query: ctx.query,
          params: ctx.params,
          body: ctx.request.body,
          header: ctx.request.headers,
        }));
      }
    } catch (e) {
      const hints = randomBytes(5).toString('hex');
      const statusCode = e.status || 500;
      const responseBody = {
        code: e.errorCode ? e.errorCode : statusCode,
        message: e.message || '未知错误',
        error: e.stack,
      };
      const loggerOpitons: ILoggerOptions = {
        type: LoggerOptionsType.info,
        label: LoggerMsgLabel.logic,
      };
      if (e instanceof LogicError) {
        loggerOpitons.label = LoggerMsgLabel.logic;
      } else if (e instanceof UnauthorizedError) {
        loggerOpitons.label = LoggerMsgLabel.unauthorized;
        if (e.code === 'credentials_bad_scheme') {
          responseBody.message = '登录失败，登录信息有误#1';
        }
        if (e.code === 'credentials_bad_format') {
          responseBody.message = '登录失败，登录信息有误#2';
        }
        if (e.code === 'credentials_required') {
          responseBody.message = '登录失败，登录信息有误#3';
        }
        if (e.code === 'invalid_token') {
          responseBody.message = '登录失败，登录信息有误#4';
        }
        if (e.code === 'revoked_token') {
          responseBody.message = '登录失败，登录信息有误#5';
        }
      } else if (e instanceof ValidateError) {
        loggerOpitons.label = LoggerMsgLabel.validate;
        responseBody.error = e.errors;
      } else {
        loggerOpitons.type = LoggerOptionsType.error;
        loggerOpitons.label = LoggerMsgLabel.unhandled;
        responseBody.message = `服务器内部错误：${e.message || '未知错误'}`;
      }

      ctx.logger[loggerOpitons.type]('[%s][hints: %s] errmsg: %s \nstack: %s \nrequest: %s \ndetail: %s', loggerOpitons.label, hints, e.message || 'null', e.stack, JSON.stringify({
        url: ctx.request.url,
        method: ctx.request.method,
        query: ctx.query,
        params: ctx.params,
        body: ctx.request.body,
        header: ctx.request.headers,
      }, null, 2), e.detail ? JSON.stringify(e.detail, null, 2) : 'null');

      responseBody.message = `${responseBody.message} [hints: ${hints}]`;
      if (ctx.app.config.appMode === mode.prod) {
        delete responseBody.error;
      }
      ctx.status = statusCode;
      ctx.body = responseBody;
    }
  };
}
