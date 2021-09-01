const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-parameter-description');
  return linter;
});

test('az-parameter-description should find errors', () => {
  // Test missing description in 3 different places:
  // 1. parameter at path level
  // 2. inline parameter at operation level
  // 3. referenced parameter at operation level
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/api/Paths': {
        parameters: [
          {
            name: 'version',
            in: 'query',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'param1',
              in: 'query',
              type: 'string',
            },
            {
              $ref: '#/parameters/Param2',
            },
          ],
        },
      },
    },
    parameters: {
      Param2: {
        name: 'param2',
        in: 'query',
        type: 'string',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./api/Paths.parameters.0');
    expect(results[1].path.join('.')).toBe('paths./api/Paths.get.parameters.0');
    expect(results[2].path.join('.')).toBe('paths./api/Paths.get.parameters.1');
  });
});

test('az-parameter-description should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/api/Paths': {
        parameters: [
          {
            name: 'version',
            in: 'query',
            type: 'string',
            description: 'A descriptive description',
          },
        ],
        get: {
          parameters: [
            {
              name: 'param1',
              in: 'query',
              type: 'string',
              description: 'A descriptive description',
            },
            {
              $ref: '#/parameters/Param2',
            },
          ],
        },
      },
    },
    parameters: {
      Param2: {
        name: 'param2',
        in: 'query',
        type: 'string',
        description: 'A descriptive description',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
