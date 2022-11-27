const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-readonly-in-response-schema');
  return linter;
});

test('az-readonly-in-response-schema should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          parameters: [
            {
              in: 'body',
              name: 'body',
              schema: {
                $ref: '#/definitions/Model1',
              },
            },
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/Model2',
              },
            },
          },
        },
      },
    },
    definitions: {
      Model1: {
        type: 'object',
        allOf: [
          {
            $ref: '#/definitions/Model3',
          },
        ],
      },
      Model2: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            readOnly: true,
          },
        },
      },
      Model3: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            readOnly: true,
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('definitions.Model2.properties.id.readOnly');
  });
});

test('az-readonly-in-response-schema should not find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          parameters: [
            {
              in: 'body',
              name: 'body',
              schema: {
                $ref: '#/definitions/Model1',
              },
            },
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/Model2',
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
          id: {
            type: 'string',
            readOnly: true,
          },
          things: {
            type: 'array',
            items: {
              $ref: '#/definitions/Thing',
            },
          },
          tags: {
            additionalProperties: {
              $ref: '#/definitions/Tag',
            },
          },
        },
        allOf: [
          {
            $ref: '#/definitions/Model3',
          },
        ],
      },
      Model2: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
        },
      },
      Model3: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            readOnly: true,
          },
        },
      },
      Thing: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            readOnly: true,
          },
        },
      },
      Tag: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            readOnly: true,
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
