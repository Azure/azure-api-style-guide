const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-patch-content-type');
  return linter;
});

test('az-patch-content-type should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    consumes: [
      'application/json',
      'application/merge-patch+json',
    ],
    paths: {
      '/test1': {
        put: {
          consumes: [
            'application/json',
            'application/merge-patch+json',
          ],
        },
        post: {
          consumes: [
            'application/json',
            'application/merge-patch+json',
          ],
        },
        patch: {
        },
      },
      '/test2': {
        patch: {
          consumes: [
            'application/json',
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5);
    expect(results[0].path.join('.')).toBe('consumes');
    expect(results[1].path.join('.')).toBe('paths./test1.put.consumes');
    expect(results[2].path.join('.')).toBe('paths./test1.post.consumes');
    expect(results[3].path.join('.')).toBe('paths./test1.patch');
    expect(results[4].path.join('.')).toBe('paths./test2.patch.consumes');
  });
});

test('az-patch-content-type should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    consumes: [
      'application/json',
    ],
    paths: {
      '/test1': {
        put: {
          consumes: [
            'application/json',
          ],
        },
        post: {
        },
        patch: {
          consumes: [
            'application/merge-patch+json',
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
