const { linterForRule } = require('./utils');

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
      '/foo/{p1}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            type: 'integer',
          },
        ],
      },
      '/bar/{p2}/baz/{p3}': {
        get: {
          parameters: [
            {
              $ref: '#/parameters/Param2',
            },
            {
              name: 'p3',
              in: 'path',
              type: 'string',
              maxLength: 50,
            },
          ],
        },
      },
    },
    parameters: {
      Param2: {
        name: 'p2',
        in: 'path',
        type: 'string',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4);
    expect(results[0].path.join('.')).toBe('paths./foo/{p1}.parameters.0');
    expect(results[0].message).toContain('should specify a maximum length');
    expect(results[0].message).toContain('and characters allowed');
    expect(results[1].path.join('.')).toBe('paths./foo/{p1}.parameters.0.type');
    expect(results[1].message).toContain('should be defined as type: string');
    expect(results[2].path.join('.')).toBe('paths./bar/{p2}/baz/{p3}.get.parameters.0');
    expect(results[2].message).toContain('should specify a maximum length');
    expect(results[3].path.join('.')).toBe('paths./bar/{p2}/baz/{p3}.get.parameters.1');
    expect(results[3].message).toContain('should specify characters allowed');
  });
});

test('az-path-parameter-schema should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
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
      '/bar/{p2}/baz/{p3}': {
        get: {
          parameters: [
            {
              $ref: '#/parameters/Param2',
            },
            {
              name: 'p3',
              in: 'path',
              type: 'string',
              maxLength: 50,
              pattern: '/[a-z]+/',
            },
          ],
        },
      },
    },
    parameters: {
      Param2: {
        name: 'p2',
        in: 'path',
        type: 'string',
        maxLength: 50,
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
      '/bar/{p2}/baz/{p3}': {
        get: {
          parameters: [
            {
              $ref: '#/components/parameters/Param2',
            },
            {
              name: 'p3',
              in: 'path',
              schema: {
                type: 'string',
                maxLength: 50,
              },
            },
          ],
        },
      },
    },
    components: {
      parameters: {
        Param2: {
          name: 'p2',
          in: 'path',
          schema: {
            type: 'string',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4);
    expect(results[0].path.join('.')).toBe('paths./foo/{p1}.parameters.0.schema');
    expect(results[0].message).toContain('should specify a maximum length');
    expect(results[0].message).toContain('and characters allowed');
    expect(results[1].path.join('.')).toBe('paths./foo/{p1}.parameters.0.schema.type');
    expect(results[1].message).toContain('should be defined as type: string');
    expect(results[2].path.join('.')).toBe('paths./bar/{p2}/baz/{p3}.get.parameters.0.schema');
    expect(results[2].message).toContain('should specify a maximum length');
    expect(results[3].path.join('.')).toBe('paths./bar/{p2}/baz/{p3}.get.parameters.1.schema');
    expect(results[3].message).toContain('should specify characters allowed');
  });
});

test('az-path-parameter-schema should find no oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0',
    paths: {
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
      },
      '/bar/{p2}/baz/{p3}': {
        get: {
          parameters: [
            {
              $ref: '#/components/parameters/Param2',
            },
            {
              name: 'p3',
              in: 'path',
              schema: {
                type: 'string',
                maxLength: 50,
                pattern: '/[a-z]+/',
              },
            },
          ],
        },
      },
    },
    components: {
      parameters: {
        Param2: {
          name: 'p2',
          in: 'path',
          schema: {
            type: 'string',
            maxLength: 50,
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
