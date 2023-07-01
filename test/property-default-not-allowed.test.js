const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-property-default-not-allowed');
  return linter;
});

test('az-property-default-not-allowed should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/path1': {
        put: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              schema: {
                $ref: '#/definitions/MyBodyModel',
              },
              required: true,
            },
          ],
          responses: {
            200: {
              description: 'OK',
              schema: {
                $ref: '#/definitions/MyResponseModel',
              },
            },
          },
        },
      },
      '/path2': {
        get: {
          responses: {
            200: {
              description: 'OK',
              schema: {
                $ref: '#/definitions/AnotherModel',
              },
            },
          },
        },
      },
    },
    definitions: {
      MyBodyModel: {
        type: 'object',
        required: ['prop1'],
        properties: {
          prop1: {
            type: 'string',
            default: 'foo',
          },
        },
      },
      MyResponseModel: {
        type: 'object',
        required: ['prop2'],
        properties: {
          prop2: {
            type: 'string',
            default: 'bar',
          },
          prop3: {
            $ref: '#/definitions/MyNestedResponseModel',
          },
        },
        allOf: [
          {
            required: ['prop5'],
            properties: {
              prop5: {
                type: 'string',
                default: 'qux',
              },
            },
          },
        ],
      },
      MyNestedResponseModel: {
        type: 'object',
        required: ['prop4'],
        properties: {
          prop4: {
            type: 'string',
            default: 'baz',
          },
        },
      },
      AnotherModel: {
        type: 'object',
        required: ['foo'],
        allOf: [
          {
            properties: {
              foo: {
                type: 'string',
                default: 'qux',
              },
            },
          },
        ],
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(4);
    expect(results[0].path.join('.')).toBe('paths./path1.put.parameters.0.schema.properties.prop1.default');
    expect(results[0].message).toBe('Schema property "prop1" is required and cannot have a default');
    expect(results[1].path.join('.')).toBe('paths./path1.put.responses.200.schema.allOf.0.properties.prop5.default');
    expect(results[1].message).toBe('Schema property "prop5" is required and cannot have a default');
    expect(results[2].path.join('.')).toBe('paths./path1.put.responses.200.schema.properties.prop2.default');
    expect(results[2].message).toBe('Schema property "prop2" is required and cannot have a default');
    expect(results[3].path.join('.')).toBe('paths./path1.put.responses.200.schema.properties.prop3.properties.prop4.default');
    expect(results[3].message).toBe('Schema property "prop4" is required and cannot have a default');
  });
});

test('az-property-default-not-allowed should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/path1': {
        put: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              schema: {
                $ref: '#/definitions/MyBodyModel',
              },
              required: true,
            },
          ],
          responses: {
            200: {
              description: 'OK',
              schema: {
                $ref: '#/definitions/MyResponseModel',
              },
            },
          },
        },
      },
    },
    definitions: {
      MyBodyModel: {
        type: 'object',
        required: ['prop1'],
        properties: {
          prop1: {
            type: 'string',
          },
        },
      },
      MyResponseModel: {
        type: 'object',
        properties: {
          prop2: {
            type: 'string',
            default: 'bar',
          },
          prop3: {
            $ref: '#/definitions/MyNestedResponseModel',
          },
        },
        allOf: [
          {
            required: ['prop5'],
            properties: {
              prop5: {
                type: 'string',
              },
            },
          },
        ],
      },
      MyNestedResponseModel: {
        type: 'object',
        required: ['prop4'],
        properties: {
          prop4: {
            type: 'string',
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
