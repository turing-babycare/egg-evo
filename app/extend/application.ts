import { Application } from 'egg';
import jwt from '../../lib/jwt/index';
const JWT = Symbol('Application#jsonwebtoken');


export default {
  get jwt(): jwt {
    if (!(this as Application)[JWT]) {
      (this as Application)[JWT] = new jwt((this as Application).config.jwt);
    }
    return (this as Application)[JWT];
  },
};
