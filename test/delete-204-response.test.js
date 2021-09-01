const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-delete-204-response');
  return linter;
});

test('az-delete-204-response should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/api/Paths': {
        delete: {
          responses: {
            200: {
              description: 'Success',
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./api/Paths.delete.responses');
  });
});

test('az-delete-204-response should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/api/Paths': {
        delete: {
          responses: {
            204: {
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
