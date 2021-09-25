const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-request-body-optional');
  return linter;
});

test('az-request-body-optional should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        put: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              type: 'string',
            },
          ],
        },
      },
      '/test2': {
        patch: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              type: 'string',
            },
          ],
        },
      },
      '/test3': {
        post: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              type: 'string',
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./test1.put.parameters.0');
    expect(results[1].path.join('.')).toBe('paths./test2.patch.parameters.0');
    expect(results[2].path.join('.')).toBe('paths./test3.post.parameters.0');
  });
});

test('az-request-body-optional should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        put: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              type: 'string',
              required: true,
            },
          ],
        },
      },
      '/test2': {
        patch: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              type: 'string',
              required: true,
            },
          ],
        },
      },
      '/test3': {
        post: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              type: 'string',
              required: true,
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
