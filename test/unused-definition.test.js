const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-unused-definition');
  return linter;
});

test('az-unused-definition should find errors', () => {
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
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                type: 'string',
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
          },
        },
      },
      Model3: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    // Note: Model3 is not flagged as unused because it is used in Model1,
    // even though Model1 is not used. And the new logic now filters out the
    // error for Model1 because it allOfs Model3.
    expect(results[0].path.join('.')).toBe('definitions.Model2');
  });
});

test('az-unused-definition should not find errors', () => {
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
      '/test2': {
        post: {
          parameters: [
            {
              in: 'body',
              name: 'body',
              schema: {
                $ref: '#/definitions/Model4',
              },
            },
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                $ref: '#/definitions/Model3',
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
          },
        },
      },
      Model3: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
        },
      },
      Model4: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
        },
      },
      Model5: {
        type: 'object',
        properties: {
          bar: {
            type: 'string',
          },
        },
        allOf: [
          {
            $ref: '#/definitions/Model4',
          },
        ],
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
