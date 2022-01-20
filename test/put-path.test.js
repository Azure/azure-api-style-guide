const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-put-path');
  return linter;
});

test('az-put-path should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/bar/baz': {
        put: {},
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./bar/baz');
  });
});

test('az-put-path should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/bar/{p1}': {
        put: {
          parameters: [
            {
              name: 'p1',
              in: 'path',
              type: 'string',
              maxLength: 50,
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
