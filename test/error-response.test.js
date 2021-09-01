const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-error-response');
  return linter;
});

test('az-error-response should find errors', () => {
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
              schema: {
                type: 'string',
              },
            },
            401: {
              description: 'Unauthorized',
              headers: {
                'x-ms-error-code': {
                  type: 'string',
                },
              },
              schema: {
                properties: {
                  code: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
            403: {
              description: 'Forbidden',
              headers: {
                'x-ms-error-code': {
                  type: 'string',
                },
              },
              schema: {
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
              'x-ms-error-response': true,
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(6);
    expect(results[0].path.join('.')).toBe('paths./api/Paths.get.responses.400');
    expect(results[0].message).toBe('Error response should contain a x-ms-error-code header.');
    expect(results[1].path.join('.')).toBe('paths./api/Paths.get.responses.400.schema');
    expect(results[1].message).toBe('Error response schema must be an object schema.');
    expect(results[2].path.join('.')).toBe('paths./api/Paths.get.responses.401');
    expect(results[2].message).toBe('Error response should contain x-ms-error-response.');
    expect(results[3].path.join('.')).toBe('paths./api/Paths.get.responses.401.schema.properties');
    expect(results[3].message).toBe('Error response schema should contain an object property named `error`.');
    expect(results[4].path.join('.')).toBe('paths./api/Paths.get.responses.403.schema');
    expect(results[4].message).toBe('The `error` property in the error response schema should be required.');
    expect(results[5].path.join('.')).toBe('paths./api/Paths.get.responses.403.schema.properties.error');
    expect(results[5].message).toBe('Error schema should define `code` and `message` properties as required.');
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
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                    required: ['code', 'message'],
                  },
                },
                required: ['error'],
              },
              'x-ms-error-response': true,
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
