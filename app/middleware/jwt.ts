import * as koajwt from 'koa-jwt2';

export default options => {
  return koajwt(options).unless(options.unless);
};
