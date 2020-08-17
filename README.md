# egg-evo

  egg框架的扩展 该扩展使得在使用egg开发微服务时能够统一
  
  [middleware扩展:](./app/middleware/)
  
  
  1. 统一错误处理  errorHandler 中间件
  2. jwt          jwt 中间件
  
  [ctx扩展:](./app/extend/context)
  3. 参数校验 ctx.validator
  4. 统一错误抛出处理  
  
  [app扩张](./app/extend/application)
  5. jwt 的相关方法
  
  配合TS食用更佳
  
  
  

## Install

```bash
$ npm i egg-evo --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.evo = {
  enable: true,
  package: 'egg-evo',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
config.jwt = {
    jwt: {
      secret: '',
      unless: { // 无需
        path: [
          'xxx/login',
        ],
      },
    },
}
config.syhhMicro = {
    SUCCESS_CODE: 20000, // 数据返回时Code的值配置
};
config.middleware = [
    'errorHandler', 'jwt',
];
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

可以直接在ctx或者service里面  使用如下方法
```js
ctx.resp()
ctx.throwLogic()
ctx.throwUnauth()
ctx.validator()
```

## Questions & Suggestions

Please open an issue [here](https://github.com/turing-babycare/egg-evo/issues).

## License

[MIT](LICENSE)
