const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-boolean-naming-convention');
  return linter;
});

test('az-boolean-naming-convention should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/path1': {
        put: {
          parameters: [
            {
              name: 'isFoo',
              in: 'query',
              type: 'boolean',
            },
            {
              name: 'body',
              in: 'body',
              schema: {
                type: 'object',
                properties: {
                  isBar: {
                    type: 'boolean',
                  },
                },
              },
            },
          ],
          responses: {
            200: {
              description: 'OK',
              schema: {
                type: 'object',
                properties: {
                  isBaz: {
                    type: 'boolean',
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./path1.put.parameters.0.name');
    expect(results[1].path.join('.')).toBe('paths./path1.put.parameters.1.schema.properties.isBar');
    expect(results[2].path.join('.')).toBe('paths./path1.put.responses.200.schema.properties.isBaz');
  });
});

test('az-boolean-naming-convention should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/path1': {
        put: {
          parameters: [
            {
              name: 'foo',
              in: 'query',
              type: 'boolean',
            },
            {
              name: 'body',
              in: 'body',
              schema: {
                type: 'object',
                properties: {
                  bar: {
                    type: 'boolean',
                  },
                },
              },
            },
          ],
          responses: {
            200: {
              description: 'OK',
              schema: {
                type: 'object',
                properties: {
                  baz: {
                    type: 'boolean',
                  },
                },
              },
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
