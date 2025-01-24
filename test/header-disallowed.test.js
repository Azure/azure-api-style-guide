const { linterForRule } = require('./utils');
require('./matchers');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-header-disallowed');
  return linter;
});

test('az-header-disallowed should find errors', () => {
  // Test parameter names in 3 different places:
  // 1. parameter at path level
  // 2. inline parameter at operation level
  // 3. referenced parameter at operation level
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        parameters: [
          {
            name: 'Authorization',
            in: 'header',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'Content-Type',
              in: 'header',
              type: 'string',
            },
            {
              $ref: '#/parameters/AcceptParam',
            },
          ],
        },
      },
    },
    parameters: {
      AcceptParam: {
        name: 'Accept',
        in: 'header',
        type: 'string',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'parameters', '0', 'name'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'get', 'parameters', '0', 'name'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'get', 'parameters', '1', 'name'],
    });
  });
});

test('az-header-disallowed should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        parameters: [
          {
            name: 'Authorization',
            in: 'query',
            type: 'string',
          },
          {
            name: 'Content-Encoding',
            in: 'header',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'Accept',
              in: 'query',
              type: 'string',
            },
            {
              name: 'Accept-Language',
              in: 'header',
              type: 'string',
            },
            {
              $ref: '#/parameters/RequestIdParam',
            },
          ],
        },
      },
    },
    parameters: {
      RequestIdParam: {
        name: 'x-ms-request-id',
        in: 'header',
        type: 'string',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
