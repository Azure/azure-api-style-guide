const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-operation-security');
  return linter;
});

test('az-operation-security should find operations without security', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          operationId: 'notNounVerb',
        },
        post: {
          operationId: 'fooBarBaz',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(2);
    expect(results[0].path.join('.')).toBe('paths./test1.get');
    expect(results[1].path.join('.')).toBe('paths./test1.post');
    results.forEach((result) => expect(result.message).toContain(
      'Operation should have a security requirement.',
    ));
  });
});

test('az-operation-security should find operations without security', () => {
  const oasDoc = {
    openapi: '3.0',
    paths: {
      '/test1': {
        get: {
          operationId: 'notNounVerb',
        },
        post: {
          operationId: 'fooBarBaz',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(2);
    expect(results[0].path.join('.')).toBe('paths./test1.get');
    expect(results[1].path.join('.')).toBe('paths./test1.post');
    results.forEach((result) => expect(result.message).toContain(
      'Operation should have a security requirement.',
    ));
  });
});

test('az-operation-security should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          operationId: 'Noun_Get',
          security: [{
            apiKey: [],
          }],
        },
        put: {
          operationId: 'Noun_Create',
          security: [{
            apiKey: [],
          }],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-operation-security should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    security: [{
      apiKey: [],
    }],
    paths: {
      '/test1': {
        get: {
          operationId: 'Noun_Get',
        },
        put: {
          operationId: 'Noun_Create',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-operation-security should find no errors', () => {
  const oasDoc = {
    openapi: '3.0',
    security: [{
      apiKey: [],
    }],
    paths: {
      '/test1': {
        get: {
          operationId: 'Noun_Get',
        },
        put: {
          operationId: 'Noun_Create',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
