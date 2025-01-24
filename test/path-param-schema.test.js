const { linterForRule } = require('./utils');
require('./matchers');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-path-parameter-schema');
  return linter;
});

test('az-path-parameter-schema should find errors', () => {
  // Test path parameter in 3 different places:
  // 1. parameter at path level
  // 2. inline parameter at operation level
  // 3. referenced parameter at operation level
  const oasDoc = {
    swagger: '2.0',
    paths: {
      // 0: should be defined as type: string
      '/foo/{p1}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            type: 'integer',
          },
        ],
      },
      // 1: should specify a maximum length (maxLength) and characters allowed (pattern) -- p2
      '/bar/{p2}': {
        put: {
          parameters: [
            {
              name: 'p2',
              in: 'path',
              type: 'string',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 2: should specify characters allowed (pattern) -- p4
      '/baz/{p3}/qux/{p4}': {
        put: {
          parameters: [
            {
              name: 'p3',
              in: 'path',
              type: 'string',
            },
            {
              $ref: '#/parameters/Param4',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 3: should be less than
      '/foobar/{p5}': {
        put: {
          parameters: [
            {
              name: 'p5',
              in: 'path',
              type: 'string',
              maxLength: 2083,
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
    },
    parameters: {
      Param4: {
        name: 'p4',
        in: 'path',
        type: 'string',
        maxLength: 64,
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4);
    expect(results).toContainMatch({
      path: ['paths', '/foo/{p1}', 'parameters', '0', 'type'],
      message: 'Path parameter should be defined as type: string.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/bar/{p2}', 'put', 'parameters', '0'],
      message: 'Path parameter should specify a maximum length (maxLength) and characters allowed (pattern).',
    });
    expect(results).toContainMatch({
      path: ['paths', '/baz/{p3}/qux/{p4}', 'put', 'parameters', '1'],
      message: 'Path parameter should specify characters allowed (pattern).',
    });
    expect(results).toContainMatch({
      path: ['paths', '/foobar/{p5}', 'put', 'parameters', '0', 'maxLength'],
      message: 'Path parameter maximum length should be less than 2083',
    });
  });
});

test('az-path-parameter-schema should find errors in patch operations', () => {
  // Test path parameter in 3 different places:
  // 1. parameter at path level
  // 2. inline parameter at operation level
  // 3. referenced parameter at operation level
  const oasDoc = {
    swagger: '2.0',
    paths: {
      // 0: should specify a maximum length (maxLength) and characters allowed (pattern) -- p2
      '/bar/{p2}': {
        patch: {
          parameters: [
            {
              name: 'p2',
              in: 'path',
              type: 'string',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 1: should specify characters allowed (pattern) -- p4
      '/baz/{p3}/qux/{p4}': {
        patch: {
          parameters: [
            {
              name: 'p3',
              in: 'path',
              type: 'string',
            },
            {
              $ref: '#/parameters/Param4',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 2: should be less than
      '/foobar/{p5}': {
        patch: {
          parameters: [
            {
              name: 'p5',
              in: 'path',
              type: 'string',
              maxLength: 2083,
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
    },
    parameters: {
      Param4: {
        name: 'p4',
        in: 'path',
        type: 'string',
        maxLength: 64,
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results).toContainMatch({
      path: ['paths', '/bar/{p2}', 'patch', 'parameters', '0'],
      message: 'Path parameter should specify a maximum length (maxLength) and characters allowed (pattern).',
    });
    expect(results).toContainMatch({
      path: ['paths', '/baz/{p3}/qux/{p4}', 'patch', 'parameters', '1'],
      message: 'Path parameter should specify characters allowed (pattern).',
    });
    expect(results).toContainMatch({
      path: ['paths', '/foobar/{p5}', 'patch', 'parameters', '0', 'maxLength'],
      message: 'Path parameter maximum length should be less than 2083',
    });
  });
});

test('az-path-parameter-schema should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      // 0: should be defined as type: string
      '/foo/{p1}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            type: 'string',
            maxLength: 50,
            pattern: '/[a-z]+/',
          },
        ],
      },
      '/bar/{p2}': {
        put: {
          parameters: [
            {
              name: 'p2',
              in: 'path',
              type: 'string',
              maxLength: 50,
              pattern: '/[a-z]+/',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
        patch: {
          parameters: [
            {
              name: 'p2',
              in: 'path',
              type: 'string',
              maxLength: 50,
              pattern: '/[a-z]+/',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      '/baz/{p3}/qux/{p4}': {
        put: {
          parameters: [
            {
              name: 'p3',
              in: 'path',
              type: 'string',
            },
            {
              $ref: '#/parameters/Param4',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
        patch: {
          parameters: [
            {
              name: 'p3',
              in: 'path',
              type: 'string',
            },
            {
              $ref: '#/parameters/Param4',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      '/foobar/{p5}': {
        put: {
          parameters: [
            {
              name: 'p5',
              in: 'path',
              type: 'string',
              maxLength: 50,
              pattern: '/[a-z]+/',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
        patch: {
          parameters: [
            {
              name: 'p5',
              in: 'path',
              type: 'string',
              maxLength: 50,
              pattern: '/[a-z]+/',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
    },
    parameters: {
      Param4: {
        name: 'p4',
        in: 'path',
        type: 'string',
        maxLength: 64,
        pattern: '/[a-z]+/',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-path-parameter-schema should find oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0',
    paths: {
      // 0: should be defined as type: string
      '/foo/{p1}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            schema: {
              type: 'integer',
            },
          },
        ],
      },
      // 1: should specify a maximum length (maxLength) and characters allowed (pattern) -- p2
      '/bar/{p2}': {
        put: {
          parameters: [
            {
              name: 'p2',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 2: should specify characters allowed (pattern) -- p4
      '/baz/{p3}/qux/{p4}': {
        put: {
          parameters: [
            {
              name: 'p3',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
            {
              $ref: '#/components/parameters/Param4',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 3: should be less than
      '/foobar/{p5}': {
        put: {
          parameters: [
            {
              name: 'p5',
              in: 'path',
              type: 'string',
              maxLength: 2083,
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
    },
    components: {
      parameters: {
        Param4: {
          name: 'p4',
          in: 'path',
          schema: {
            type: 'string',
            maxLength: 64,
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4);
    expect(results).toContainMatch({
      path: ['paths', '/foo/{p1}', 'parameters', '0', 'schema', 'type'],
      message: 'Path parameter should be defined as type: string.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/bar/{p2}', 'put', 'parameters', '0', 'schema'],
      message: 'Path parameter should specify a maximum length (maxLength) and characters allowed (pattern).',
    });
    expect(results).toContainMatch({
      path: ['paths', '/baz/{p3}/qux/{p4}', 'put', 'parameters', '1', 'schema'],
      message: 'Path parameter should specify characters allowed (pattern).',
    });
    expect(results).toContainMatch({
      path: ['paths', '/foobar/{p5}', 'put', 'parameters', '0', 'maxLength'],
      message: 'Path parameter maximum length should be less than 2083',
    });
  });
});

test('az-path-parameter-schema should find no oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0',
    paths: {
      // 0: should be defined as type: string
      '/foo/{p1}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            schema: {
              type: 'string',
              maxLength: 50,
              pattern: '/[a-z]+/',
            },
          },
        ],
        responses: {
          201: {
            description: 'Created',
          },
        },
      },
      // 1: should specify a maximum length (maxLength) and characters allowed (pattern) -- p2
      '/bar/{p2}': {
        put: {
          parameters: [
            {
              name: 'p2',
              in: 'path',
              schema: {
                type: 'string',
                maxLength: 50,
                pattern: '/[a-z]+/',
              },
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 2: should specify characters allowed (pattern) -- p4
      '/baz/{p3}/qux/{p4}': {
        put: {
          parameters: [
            {
              name: 'p3',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
            {
              $ref: '#/components/parameters/Param4',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 3: should be less than
      '/foobar/{p5}': {
        put: {
          parameters: [
            {
              name: 'p5',
              in: 'path',
              type: 'string',
              maxLength: 50,
              pattern: '/[a-z]+/',
            },
          ],
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
    },
    components: {
      parameters: {
        Param4: {
          name: 'p4',
          in: 'path',
          schema: {
            type: 'string',
            maxLength: 64,
            pattern: '/[a-z]+/',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
