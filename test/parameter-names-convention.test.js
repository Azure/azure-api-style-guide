const { linterForRule } = require('./utils');
require('./matchers');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-parameter-names-convention');
  return linter;
});

test('az-parameter-names-convention should find errors', () => {
  // Test parameter names in 3 different places:
  // 1. parameter at path level
  // 2. inline parameter at operation level
  // 3. referenced parameter at operation level
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{test-id}': {
        parameters: [
          {
            name: 'test-id',
            in: 'path',
            type: 'string',
          },
          {
            name: 'foo_bar',
            in: 'query',
            type: 'string',
          },
          {
            name: 'fooBar',
            in: 'header',
            type: 'string',
            description: 'Camel case header',
          },
          {
            name: '$foo-bar',
            in: 'header',
            type: 'string',
            description: '$ should not be first character of header',
          },
          {
            name: '@foo-bar',
            in: 'header',
            type: 'string',
            description: '@ should not be first character of header',
          },
        ],
        get: {
          parameters: [
            {
              name: 'resource-id',
              in: 'query',
              type: 'string',
            },
            {
              $ref: '#/parameters/SkipParam',
            },
          ],
        },
      },
    },
    parameters: {
      SkipParam: {
        name: '$skip',
        in: 'query',
        type: 'integer',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(7);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{test-id}', 'parameters', '0', 'name'],
      message: 'Parameter name "test-id" should be camel case.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{test-id}', 'parameters', '1', 'name'],
      message: 'Parameter name "foo_bar" should be camel case.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{test-id}', 'parameters', '2', 'name'],
      message: 'header parameter name "fooBar" should be kebab case.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{test-id}', 'parameters', '3', 'name'],
      message: 'Parameter name "$foo-bar" should not begin with \'$\' or \'@\'.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{test-id}', 'parameters', '4', 'name'],
      message: 'Parameter name "@foo-bar" should not begin with \'$\' or \'@\'.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{test-id}', 'get', 'parameters', '0', 'name'],
      message: 'Parameter name "resource-id" should be camel case.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{test-id}', 'get', 'parameters', '1', 'name'],
      message: 'Parameter name "$skip" should not begin with \'$\' or \'@\'.',
    });
  });
});

test('az-parameter-names-convention should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{id}': {
        parameters: [
          {
            name: 'id',
            in: 'path',
            type: 'string',
          },
          {
            name: 'fooBar',
            in: 'query',
            type: 'string',
          },
          {
            name: 'foo-bar',
            in: 'header',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'resourceId',
              in: 'query',
              type: 'string',
            },
            {
              $ref: '#/parameters/SkipParam',
            },
          ],
        },
      },
    },
    parameters: {
      SkipParam: {
        name: 'skip',
        in: 'query',
        type: 'integer',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
