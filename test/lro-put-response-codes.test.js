const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-lro-put-response-codes');
  return linter;
});

test('az-lro-put-response-codes should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        put: {
          responses: {
            202: {
              description: 'Accepted',
            },
          },
        },
      },
      '/test2': {
        put: {
          responses: {
            200: {
              description: 'Success',
            },
            201: {
              description: 'Created',
            },
            202: {
              description: 'Accepted',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(2);
    expect(results[0].path.join('.')).toBe('paths./test1.put.responses.202');
    expect(results[1].path.join('.')).toBe('paths./test2.put.responses.202');
    results.forEach((result) => expect(result.message).toBe(
      'Long-running PUT should not return a 202 response.',
    ));
  });
});

test('az-lro-put-response-codes should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        put: {
          responses: {
            200: {
              description: 'Success',
            },
            201: {
              description: 'Created',
            },
          },
        },
      },
      '/test2': {
        put: {
          responses: {
            200: {
              description: 'Success',
            },
          },
        },
      },
      '/test3': {
        put: {
          responses: {
            201: {
              description: 'Created',
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
