const { linterForRule } = require('./utils');
require('./matchers');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-schema-type-and-format');
  return linter;
});

test('az-schema-type-and-format should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          parameters: [
            {
              name: 'version',
              in: 'body',
              schema: {
                type: 'object',
                properties: {
                  prop1: {
                    type: 'integer',
                    format: 'int52',
                  },
                  prop2: {
                    type: 'object',
                    properties: {
                      prop3: {
                        type: 'string',
                        format: 'special',
                      },
                    },
                  },
                  prop3: {
                    type: 'boolean',
                    format: 'yes-or-no',
                  },
                  prop4: {
                    type: 'number',
                  },
                },
                allOf: [
                  {
                    properties: {
                      prop5: {
                        type: 'string',
                        format: 'email',
                      },
                    },
                  },
                ],
              },
            },
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/Model1',
              },
            },
          },
        },
        put: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/ModelB',
              },
            },
          },
        },
      },
    },
    definitions: {
      Model1: {
        type: 'object',
        properties: {
          propW: {
            type: 'number',
            format: 'exponential',
          },
          propX: {
            type: 'object',
            properties: {
              propY: {
                type: 'string',
                format: 'secret',
              },
            },
          },
          propZ: {
            type: 'integer',
          },
          propZZ: {
            $ref: '#/definitions/PropZZ',
          },
        },
        allOf: [
          {
            $ref: '#/definitions/ModelA',
          },
        ],
      },
      PropZZ: {
        type: 'string',
        format: 'ZZTop',
      },
      ModelA: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'guid',
          },
        },
      },
      ModelB: {
        type: 'object',
        properties: {
          things: {
            type: 'array',
            items: {
              type: 'string',
              format: 'whacky',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(11);
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'parameters', '0', 'schema', 'properties', 'prop1', 'format'],
      message: 'Schema with type: integer has unrecognized format: int52',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'parameters', '0', 'schema', 'properties', 'prop1', 'format'],
      message: 'Schema with type: integer has unrecognized format: int52',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'parameters', '0', 'schema', 'properties', 'prop2', 'properties', 'prop3', 'format'],
      message: 'Schema with type: string has unrecognized format: special',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'parameters', '0', 'schema', 'properties', 'prop3', 'format'],
      message: 'Schema with type: boolean should not specify format',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'parameters', '0', 'schema', 'properties', 'prop4'],
      message: 'Schema with type: number should specify format',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'parameters', '0', 'schema', 'allOf', '0', 'properties', 'prop5', 'format'],
      message: 'Schema with type: string has unrecognized format: email',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'responses', '200', 'schema', 'allOf', '0', 'properties', 'id', 'format'],
      message: 'Schema with type: string has unrecognized format: guid',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'responses', '200', 'schema', 'properties', 'propW', 'format'],
      message: 'Schema with type: number has unrecognized format: exponential',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'responses', '200', 'schema', 'properties', 'propX', 'properties', 'propY', 'format'],
      message: 'Schema with type: string has unrecognized format: secret',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'responses', '200', 'schema', 'properties', 'propZ'],
      message: 'Schema with type: integer should specify format',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'responses', '200', 'schema', 'properties', 'propZZ', 'format'],
      message: 'Schema with type: string has unrecognized format: ZZTop',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'put', 'responses', '200', 'schema', 'properties', 'things', 'items', 'format'],
      message: 'Schema with type: string has unrecognized format: whacky',
    });
  });
});

test('az-schema-type-and-format should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          parameters: [
            {
              name: 'version',
              in: 'body',
              schema: {
                type: 'object',
                properties: {
                  prop1: {
                    type: 'integer',
                    format: 'int64',
                  },
                  prop2: {
                    type: 'object',
                    properties: {
                      prop3: {
                        type: 'string',
                        format: 'byte',
                      },
                    },
                  },
                  prop3: {
                    type: 'boolean',
                  },
                  prop4: {
                    type: 'number',
                    format: 'float',
                  },
                },
                allOf: [
                  {
                    properties: {
                      prop5: {
                        type: 'string',
                      },
                    },
                  },
                ],
              },
            },
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/Model1',
              },
            },
          },
        },
      },
    },
    definitions: {
      Model1: {
        type: 'object',
        properties: {
          propW: {
            type: 'number',
            format: 'double',
          },
          propX: {
            type: 'object',
            properties: {
              propY: {
                type: 'string',
                format: 'duration',
              },
            },
          },
          propZ: {
            type: 'integer',
            format: 'int32',
          },
          propZZ: {
            $ref: '#/definitions/PropZZ',
          },
        },
        allOf: [
          {
            $ref: '#/definitions/ModelA',
          },
        ],
      },
      PropZZ: {
        type: 'string',
        format: 'url',
      },
      PropZZ2: {
        type: 'string',
        format: 'uri',
      },
      ModelA: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
