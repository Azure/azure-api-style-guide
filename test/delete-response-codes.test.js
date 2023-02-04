const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-delete-response-codes');
  return linter;
});

test('az-delete-response-codes should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/test1': {
        delete: {
          responses: {
            200: {
              description: 'Success',
            },
          },
        },
      },
      '/test2': {
        delete: {
          responses: {
            200: {
              description: 'Success',
            },
            204: {
              description: 'No Content',
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./test1.delete.responses');
    expect(results[1].path.join('.')).toBe('paths./test2.delete.responses');
  });
});

test('az-delete-response-codes should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/test1': {
        delete: {
          responses: {
            204: {
              description: 'Success',
            },
          },
        },
      },
      '/test202': {
        delete: {
          responses: {
            202: {
              description: 'Success',
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
