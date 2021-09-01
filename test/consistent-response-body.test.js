const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-consistent-response-body');
  return linter;
});

test('az-consistent-response-body should find errors', async () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{id}': {
        parameters: {
          name: 'id',
          in: 'path',
          type: 'string',
        },
        put: {
          responses: {
            201: {
              description: 'Created',
              schema: {
                $ref: '#/definitions/This',
              },
            },
          },
        },
        patch: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/That',
              },
            },
          },
        },
        get: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/ThaOther',
              },
            },
          },
        },
      },
    },
    definitions: {
      This: {
        description: 'This',
        type: 'object',
      },
      That: {
        description: 'That',
        type: 'object',
      },
      ThaOther: {
        description: 'ThaOther',
        type: 'object',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./test1/{id}.patch.responses.200.schema');
    expect(results[0].message).toBe('Response body schema does not match create response body schema.');
    expect(results[1].path.join('.')).toBe('paths./test1/{id}.get.responses.200.schema');
    expect(results[1].message).toBe('Response body schema does not match create response body schema.');
  });
});

test('az-consistent-response-body should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{id}': {
        parameters: {
          name: 'id',
          in: 'path',
          type: 'string',
        },
        put: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/This',
              },
            },
            201: {
              description: 'Created',
              schema: {
                $ref: '#/definitions/This',
              },
            },
          },
        },
        post: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/This',
              },
            },
          },
        },
        get: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/This',
              },
            },
          },
        },
      },
    },
    definitions: {
      This: {
        description: 'This',
        type: 'object',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
