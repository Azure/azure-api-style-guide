const { linterForRule } = require('./utils');

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
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(10);
    expect(results[0].path.join('.')).toBe('paths./test1.post.parameters.0.schema.properties.prop1.format');
    expect(results[0].message).toBe('Schema with type: integer has unrecognized format: int52');
    expect(results[1].path.join('.')).toBe('paths./test1.post.parameters.0.schema.properties.prop2.properties.prop3.format');
    expect(results[1].message).toBe('Schema with type: string has unrecognized format: special');
    expect(results[2].path.join('.')).toBe('paths./test1.post.parameters.0.schema.properties.prop3.format');
    expect(results[2].message).toBe('Schema with type: boolean should not specify format');
    expect(results[3].path.join('.')).toBe('paths./test1.post.parameters.0.schema.properties.prop4');
    expect(results[3].message).toBe('Schema with type: number should specify format');
    expect(results[4].path.join('.')).toBe('paths./test1.post.parameters.0.schema.allOf.0.properties.prop5.format');
    expect(results[4].message).toBe('Schema with type: string has unrecognized format: email');
    expect(results[5].path.join('.')).toBe('paths./test1.post.responses.200.schema.allOf.0.properties.id.format');
    expect(results[5].message).toBe('Schema with type: string has unrecognized format: guid');
    expect(results[6].path.join('.')).toBe('paths./test1.post.responses.200.schema.properties.propW.format');
    expect(results[6].message).toBe('Schema with type: number has unrecognized format: exponential');
    expect(results[7].path.join('.')).toBe('paths./test1.post.responses.200.schema.properties.propX.properties.propY.format');
    expect(results[7].message).toBe('Schema with type: string has unrecognized format: secret');
    expect(results[8].path.join('.')).toBe('paths./test1.post.responses.200.schema.properties.propZ');
    expect(results[8].message).toBe('Schema with type: integer should specify format');
    expect(results[9].path.join('.')).toBe('paths./test1.post.responses.200.schema.properties.propZZ.format');
    expect(results[9].message).toBe('Schema with type: string has unrecognized format: ZZTop');
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
