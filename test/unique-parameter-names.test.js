const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-unique-parameter-names');
  return linter;
});

test('az-unique-parameter-names should find errors', () => {
  // Test parameter names in 3 different places:
  // 1. parameter at path level
  // 2. inline parameter at operation level
  // 3. referenced parameter at operation level
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{p1}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            type: 'string',
          },
          // Legal in OAS2 for same name w/ different in
          {
            name: 'p1',
            in: 'query',
            type: 'string',
          },
          {
            name: 'p2',
            in: 'query',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'p1',
              in: 'header',
              type: 'string',
            },
            {
              $ref: '#/parameters/Param2',
            },
            {
              name: 'p3',
              in: 'query',
              type: 'string',
            },
            {
              name: 'p3',
              in: 'header',
              type: 'string',
            },
          ],
        },
      },
    },
    parameters: {
      Param2: {
        name: 'p2',
        in: 'header',
        type: 'integer',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4);
    expect(results[0].path.join('.')).toBe('paths./test1/{p1}.parameters.1.name');
    expect(results[1].path.join('.')).toBe('paths./test1/{p1}.get.parameters.0.name');
    expect(results[2].path.join('.')).toBe('paths./test1/{p1}.get.parameters.1.name');
    expect(results[3].path.join('.')).toBe('paths./test1/{p1}.get.parameters.3.name');
  });
});

test('az-unique-parameter-names should find no errors', () => {
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
