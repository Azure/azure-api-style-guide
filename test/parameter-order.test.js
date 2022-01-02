const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-parameter-order');
  return linter;
});

test('az-parameter-order should find errors', () => {
  // Test parameter ordering at path item level and operation level.
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{p1}/foo/{p2}': {
        parameters: [
          {
            name: 'p2',
            in: 'path',
            type: 'string',
          },
          {
            name: 'p1',
            in: 'path',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'p3',
              in: 'query',
              type: 'string',
            },
          ],
        },
      },
      '/test2/{p1}/foo/{p2}/bar/{p3}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'p3',
              in: 'path',
              type: 'string',
            },
            {
              name: 'p2',
              in: 'path',
              type: 'string',
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./test1/{p1}/foo/{p2}.parameters');
    expect(results[1].path.join('.')).toBe('paths./test2/{p1}/foo/{p2}/bar/{p3}.get.parameters');
  });
});

test('az-parameter-order should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{p1}/foo/{p2}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            type: 'string',
          },
          {
            name: 'p2',
            in: 'path',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'p3',
              in: 'query',
              type: 'string',
            },
          ],
        },
      },
      '/test2/{p1}/foo/{p2}/bar/{p3}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'p2',
              in: 'path',
              type: 'string',
            },
            {
              name: 'p3',
              in: 'path',
              type: 'string',
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-parameter-order should find oas3 errors', () => {
  // Test parameter ordering at path item level and operation level.
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{p1}/foo/{p2}': {
        parameters: [
          {
            name: 'p2',
            in: 'path',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'p1',
            in: 'path',
            schema: {
              type: 'string',
            },
          },
        ],
        get: {
          parameters: [
            {
              name: 'p3',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
      '/test2/{p1}/foo/{p2}/bar/{p3}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            schema: {
              type: 'string',
            },
          },
        ],
        get: {
          parameters: [
            {
              name: 'p3',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'p2',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./test1/{p1}/foo/{p2}.parameters');
    expect(results[1].path.join('.')).toBe('paths./test2/{p1}/foo/{p2}/bar/{p3}.get.parameters');
  });
});

test('az-parameter-order should find no oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{p1}/foo/{p2}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'p2',
            in: 'path',
            schema: {
              type: 'string',
            },
          },
        ],
        get: {
          parameters: [
            {
              name: 'p3',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
      '/test2/{p1}/foo/{p2}/bar/{p3}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            schema: {
              type: 'string',
            },
          },
        ],
        get: {
          parameters: [
            {
              name: 'p2',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'p3',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
