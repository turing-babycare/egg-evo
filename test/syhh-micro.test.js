'use strict';

const mock = require('egg-mock');

describe('test/syhh-micro.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/syhh-micro-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, syhhMicro')
      .expect(200);
  });
});
