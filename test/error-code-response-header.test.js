const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-error-code-response-header');
  return linter;
});

test('az-error-code-response-header should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/api/Paths': {
        get: {
          responses: {
            200: {
              description: 'Success',
            },
            // Error response should contain a x-ms-error-code header.
            400: {
              description: 'Bad request',
              schema: {
                type: 'string',
              },
            },
            default: {
              description: 'Precondition Failed',
              schema: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    // For some reason the paths have "schema" appended to them here,
    // but not when run in VSCode or the CLI.
    expect(results[0].path.join('.')).toBe('paths./api/Paths.get.responses.400');
    expect(results[0].message).toBe('Error response should contain a x-ms-error-code header.');
    expect(results[1].path.join('.')).toBe('paths./api/Paths.get.responses.default');
    expect(results[1].message).toBe('Error response should contain a x-ms-error-code header.');
  });
});

test('az-error-response should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/api/Paths': {
        get: {
          responses: {
            200: {
              description: 'Success',
            },
            400: {
              description: 'Bad request',
              headers: {
                'x-ms-error-code': {
                  type: 'string',
                },
              },
              schema: {
                type: 'string',
              },
            },
            default: {
              description: 'Bad request',
              headers: {
                'x-ms-error-code': {
                  type: 'string',
                },
              },
              schema: {
                type: 'string',
              },
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
