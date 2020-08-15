/* eslint-disable no-useless-constructor */

import { sign, Secret, SignOptions, verify } from 'jsonwebtoken';

interface JWTOptions {
  secret: Secret;
}


export interface JwtConfig {
  secret: string;
  unless?: object[];
}

export default class JWT {
  constructor(public options: JWTOptions) {}

  sign(payload: string | object | Buffer, options?: SignOptions) {
    return sign(payload, this.options.secret, options || {});
  }

  verify(token: string) {
    return verify(token, this.options.secret);
  }
}
