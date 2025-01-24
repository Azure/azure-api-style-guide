const { linterForRule } = require('./utils');
require('./matchers');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-datetime-naming-convention');
  return linter;
});

// Stuff to test:
// - oas2 and oas3
// - oas2 body parameters defined inline
// - oas2 body parameters defined with a $ref
// - oas3 requestBody defined inline
// - oas3 requestBody defined with a $ref
// - oas2 responses defined inline
// - oas2 responses defined with a $ref
// - schema with items
// - schema with allOf
// - schema with anyOf
// - schema with oneOf

test('az-datetime-naming-convention should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      // - oas2 body parameters defined inline
      // - oas2 responses defined inline
      '/path1': {
        put: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              schema: {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string',
                    format: 'date-time',
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
                  bar: {
                    type: 'string',
                    format: 'date-time',
                  },
                },
              },
            },
          },
        },
      },
      // - oas2 body parameters defined with a $ref
      // - oas2 responses defined with a $ref
      '/path2': {
        put: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              schema: {
                $ref: '#/definitions/Foo',
              },
            },
          ],
          responses: {
            200: {
              description: 'OK',
              schema: {
                $ref: '#/definitions/Bar',
              },
            },
          },
        },
      },
      // - schema with items
      '/path3': {
        get: {
          responses: {
            200: {
              description: 'OK',
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
        },
      },
      // - schema with allOf
      '/path4': {
        post: {
          responses: {
            200: {
              description: 'OK',
              schema: {
                allOf: [
                  {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string',
                        format: 'date-time',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      bar: {
                        type: 'string',
                        format: 'date-time',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    definitions: {
      Foo: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Bar: {
        type: 'object',
        properties: {
          bar: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(7);
    expect(results).toContainMatch({
      path: ['paths', '/path1', 'put', 'parameters', '0', 'schema', 'properties', 'foo'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path1', 'put', 'responses', '200', 'schema', 'properties', 'bar'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path2', 'put', 'parameters', '0', 'schema', 'properties', 'foo'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path2', 'put', 'responses', '200', 'schema', 'properties', 'bar'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path3', 'get', 'responses', '200', 'schema', 'items', 'properties', 'foo'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path4', 'post', 'responses', '200', 'schema', 'allOf', '0', 'properties', 'foo'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path4', 'post', 'responses', '200', 'schema', 'allOf', '1', 'properties', 'bar'],
    });
  });
});

test('az-datetime-naming-convention should find oas3 errors', () => {
  const myOpenApiDocument = {
    openapi: '3.0.0',
    paths: {
      // - oas3 requestBody defined inline
      '/path1': {
        put: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      bar: {
                        type: 'string',
                        format: 'date-time',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // - oas3 requestBody defined with a $ref
      '/path2': {
        put: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Foo',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Bar',
                  },
                },
              },
            },
          },
        },
      },
      // - schema with anyOf
      '/path3': {
        get: {
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    anyOf: [
                      {
                        type: 'object',
                        properties: {
                          foo: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                      },
                      {
                        type: 'object',
                        properties: {
                          bar: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      // - schema with oneOf
      '/path4': {
        post: {
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      {
                        type: 'object',
                        properties: {
                          foo: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                      },
                      {
                        type: 'object',
                        properties: {
                          bar: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Foo: {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Bar: {
          type: 'object',
          properties: {
            bar: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(8);
    expect(results).toContainMatch({
      path: ['paths', '/path1', 'put', 'requestBody', 'content', 'application/json', 'schema', 'properties', 'foo'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path1', 'put', 'responses', '200', 'content', 'application/json', 'schema', 'properties', 'bar'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path2', 'put', 'requestBody', 'content', 'application/json', 'schema', 'properties', 'foo'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path2', 'put', 'responses', '200', 'content', 'application/json', 'schema', 'properties', 'bar'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path3', 'get', 'responses', '200', 'content', 'application/json', 'schema', 'anyOf', '0', 'properties', 'foo'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path3', 'get', 'responses', '200', 'content', 'application/json', 'schema', 'anyOf', '1', 'properties', 'bar'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path4', 'post', 'responses', '200', 'content', 'application/json', 'schema', 'oneOf', '0', 'properties', 'foo'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/path4', 'post', 'responses', '200', 'content', 'application/json', 'schema', 'oneOf', '1', 'properties', 'bar'],
    });
  });
});

// Test parameter names
test('az-datetime-naming-convention should find errors in parameter names', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/path1': {
        put: {
          parameters: [
            {
              name: 'foo',
              in: 'query',
              type: 'string',
              format: 'date-time',
            },
          ],
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
      '/path2': {
        delete: {
          parameters: [
            {
              name: 'foo',
              in: 'query',
              type: 'string',
            },
            {
              name: 'bar',
              in: 'query',
              type: 'string',
              format: 'date-time',
            },
          ],
          responses: {
            204: {
              description: 'No Content',
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./path1.put.parameters.0.name');
    expect(results[1].path.join('.')).toBe('paths./path2.delete.parameters.1.name');
  });
});

test('az-datetime-naming-convention should find errors in oas3 parameter names', () => {
  const myOpenApiDocument = {
    openapi: '3.0.0',
    paths: {
      '/path1': {
        put: {
          parameters: [
            {
              name: 'foo',
              in: 'query',
              schema: {
                type: 'string',
                format: 'date-time',
              },
            },
          ],
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
      '/path2': {
        delete: {
          parameters: [
            {
              name: 'foo',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'bar',
              in: 'path',
              schema: {
                type: 'string',
                format: 'date-time',
              },
            },
          ],
          responses: {
            204: {
              description: 'No Content',
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./path1.put.parameters.0.name');
    expect(results[1].path.join('.')).toBe('paths./path2.delete.parameters.1.name');
  });
});

test('az-datetime-naming-convention should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      // - oas2 body parameters defined inline
      // - oas2 responses defined inline
      '/path1': {
        put: {
          parameters: [
            {
              name: 'fooAt',
              in: 'query',
              type: 'string',
              format: 'date-time',
            },
            {
              name: 'body',
              in: 'body',
              schema: {
                type: 'object',
                properties: {
                  fooAt: {
                    type: 'string',
                    format: 'date-time',
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
                  barAt: {
                    type: 'string',
                    format: 'date-time',
                  },
                },
              },
            },
          },
        },
      },
      // - oas2 body parameters defined with a $ref
      // - oas2 responses defined with a $ref
      '/path2': {
        put: {
          parameters: [
            {
              name: 'foo',
              in: 'query',
              type: 'string',
            },
            {
              name: 'barAt',
              in: 'query',
              type: 'string',
              format: 'date-time',
            },
            {
              name: 'body',
              in: 'body',
              schema: {
                $ref: '#/definitions/Foo',
              },
            },
          ],
          responses: {
            200: {
              description: 'OK',
              schema: {
                $ref: '#/definitions/Bar',
              },
            },
          },
        },
      },
      // - schema with items
      '/path3': {
        get: {
          responses: {
            200: {
              description: 'OK',
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    fooAt: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
        },
      },
      // - schema with allOf
      '/path4': {
        post: {
          responses: {
            200: {
              description: 'OK',
              schema: {
                allOf: [
                  {
                    type: 'object',
                    properties: {
                      fooAt: {
                        type: 'string',
                        format: 'date-time',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      barAt: {
                        type: 'string',
                        format: 'date-time',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    definitions: {
      Foo: {
        type: 'object',
        properties: {
          fooAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Bar: {
        type: 'object',
        properties: {
          barAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-datetime-naming-convention should find no errors in oas3', () => {
  const myOpenApiDocument = {
    openapi: '3.0.0',
    paths: {
      // - oas3 body parameters defined inline
      // - oas3 responses defined inline
      '/path1': {
        put: {
          parameters: [
            {
              name: 'fooAt',
              in: 'query',
              schema: {
                type: 'string',
                format: 'date-time',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    fooAt: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      barAt: {
                        type: 'string',
                        format: 'date-time',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // - oas3 requestBody defined with a $ref
      '/path2': {
        put: {
          parameters: [
            {
              name: 'foo',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'barAt',
              in: 'path',
              schema: {
                type: 'string',
                format: 'date-time',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Foo',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Bar',
                  },
                },
              },
            },
          },
        },
      },
      // - schema with anyOf
      '/path3': {
        get: {
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    anyOf: [
                      {
                        type: 'object',
                        properties: {
                          fooAt: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                      },
                      {
                        type: 'object',
                        properties: {
                          barAt: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      // - schema with oneOf
      '/path4': {
        post: {
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      {
                        type: 'object',
                        properties: {
                          fooAt: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                      },
                      {
                        type: 'object',
                        properties: {
                          barAt: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Foo: {
          type: 'object',
          properties: {
            fooAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Bar: {
          type: 'object',
          properties: {
            barAt: {
              type: 'string',
              format: 'date-time',
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
