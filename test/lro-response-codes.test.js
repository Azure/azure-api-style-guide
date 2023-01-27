const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-lro-response-codes');
  return linter;
});

test('az-lro-response-codes should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          responses: {
            200: {
              description: 'Success',
            },
            202: {
              description: 'Accepted',
            },
          },
        },
      },
      '/test2': {
        delete: {
          responses: {
            202: {
              description: 'Accepted',
            },
            204: {
              description: 'No Content',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(2);
    expect(results[0].path.join('.')).toBe('paths./test1.post.responses');
    expect(results[1].path.join('.')).toBe('paths./test2.delete.responses');
    results.forEach((result) => expect(result.message).toBe(
      'An operation that returns 202 should not return other 2XX responses.',
    ));
  });
});

test('az-lro-response-codes should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
            },
          },
        },
      },
      '/test2': {
        delete: {
          responses: {
            202: {
              description: 'Accepted',
            },
          },
        },
      },
      '/test3': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
            },
            default: {
              description: 'Error',
            },
          },
        },
      },
      '/test4': {
        delete: {
          responses: {
            202: {
              description: 'Accepted',
            },
            default: {
              description: 'Error',
            },
          },
        },
      },
      '/test5': {
        post: {
          responses: {
            200: {
              description: 'Success',
            },
          },
        },
      },
      '/test6': {
        delete: {
          responses: {
            204: {
              description: 'No Content',
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
