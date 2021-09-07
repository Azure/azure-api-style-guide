const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-version-policy');
  return linter;
});

test('az-version-policy should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/v1/test1': {
        get: {
          responses: {
            default: {
              description: 'default',
            },
          },
        },
      },
      '/test2': {
        get: {
          // no parameters
          responses: {
            default: {
              description: 'default',
            },
          },
        },
      },
      '/test3': {
        get: {
          parameters: [
            {
              name: 'p1',
              in: 'query',
              type: 'string',
            },
          ],
          responses: {
            default: {
              description: 'default',
            },
          },
        },
      },
      '/test4': {
        get: {
          parameters: [
            {
              name: 'api-version',
              in: 'query',
              type: 'string',
            },
          ],
          responses: {
            default: {
              description: 'default',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5);
    expect(results[0].path.join('.')).toBe('paths./v1/test1');
    expect(results[1].path.join('.')).toBe('paths./v1/test1.get');
    expect(results[2].path.join('.')).toBe('paths./test2.get');
    expect(results[3].path.join('.')).toBe('paths./test3.get.parameters');
    expect(results[4].path.join('.')).toBe('paths./test4.get.parameters.0');
  });
});

test('az-version-policy should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          parameters: [
            {
              name: 'api-version',
              in: 'query',
              type: 'string',
              required: true,
            },
          ],
          responses: {
            default: {
              description: 'default',
            },
          },
        },
      },
      '/test2': {
        parameters: [
          {
            name: 'api-version',
            in: 'query',
            type: 'string',
            required: true,
          },
        ],
        get: {
          responses: {
            default: {
              description: 'default',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
