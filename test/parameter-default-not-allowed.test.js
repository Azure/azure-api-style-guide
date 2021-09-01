const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-parameter-default-not-allowed');
  return linter;
});

test('az-parameter-default-not-allowed should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/path1': {
        parameters: [
          {
            name: 'param1',
            in: 'query',
            type: 'string',
            required: true,
            default: 'param1',
          },
        ],
        get: {
          parameters: [
            {
              name: 'param2',
              in: 'query',
              type: 'string',
              required: true,
              default: 'param2',
            },
          ],
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./path1.parameters.0.default');
    expect(results[1].path.join('.')).toBe('paths./path1.get.parameters.0.default');
  });
});

test('az-parameter-default-not-allowed should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/path1': {
        parameters: [
          {
            name: 'param1',
            in: 'query',
            type: 'string',
            required: false,
            default: 'param1',
          },
        ],
        get: {
          parameters: [
            {
              name: 'param2',
              in: 'query',
              type: 'string',
              default: 'param2',
            },
          ],
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
