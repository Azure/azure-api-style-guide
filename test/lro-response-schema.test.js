const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-lro-response-schema');
  return linter;
});

test('az-lro-response-schema should find errors', () => {
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
        post: {
          responses: {
            202: {
              description: 'Accepted',
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  status: {
                    type: 'string',
                    enum: ['Running', 'Succeeded', 'Failed', 'Canceled'],
                  },
                },
              },
            },
          },
        },
      },
      '/test3': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'uuid',
                  },
                  status: {
                    type: 'string',
                    enum: ['InProgress', 'Succeeded', 'Failed', 'Canceled'],
                  },
                  error: {
                    type: 'string',
                  },
                },
                required: ['id', 'status', 'error'],
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(8);
    expect(results[0].path.join('.')).toBe('paths./test1.post.responses.202');
    expect(results[0].message).toBe('A 202 response should include a schema for the operation status monitor.');
    expect(results[1].path.join('.')).toBe('paths./test2.post.responses.202.schema');
    expect(results[1].message).toBe('`id` property in LRO response should be required');
    expect(results[2].path.join('.')).toBe('paths./test2.post.responses.202.schema');
    expect(results[2].message).toBe('`status` property in LRO response should be required');
    expect(results[3].path.join('.')).toBe('paths./test2.post.responses.202.schema.properties');
    expect(results[3].message).toBe('LRO response should contain top-level property `error`');
    expect(results[4].path.join('.')).toBe('paths./test3.post.responses.202.schema.properties.id.type');
    expect(results[4].message).toBe('\'id\' property in LRO response should be type: string');
    expect(results[5].path.join('.')).toBe('paths./test3.post.responses.202.schema.properties.status.enum');
    expect(results[5].message).toBe('\'status\' property enum in LRO response should contain values: Running, Succeeded, Failed, Canceled');
    expect(results[6].path.join('.')).toBe('paths./test3.post.responses.202.schema.properties.error.type');
    expect(results[6].message).toBe('`error` property in LRO response should be type: object');
    expect(results[7].path.join('.')).toBe('paths./test3.post.responses.202.schema.required');
    expect(results[7].message).toBe('`error` property in LRO response should not be required');
  });
});

test('az-lro-response-schema should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  status: {
                    type: 'string',
                    enum: ['Running', 'Succeeded', 'Failed', 'Canceled'],
                  },
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
                required: ['id', 'status'],
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(0);
  });
});
