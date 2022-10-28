const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-path-case-convention');
  return linter;
});

test('az-path-case-convention should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/fooBar': {},
      '/foo-bar/{id}/barBaz': {},
      '/foo/{bar}:bazQux': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./fooBar');
    expect(results[1].path.join('.')).toBe('paths./foo-bar/{id}/barBaz');
    expect(results[2].path.join('.')).toBe('paths./foo/{bar}:bazQux');
  });
});

test('az-path-case-convention should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/': {},
      '/:foobar': {},
      '/abcdefghijklmnopqrstuvwxyz0123456789': {},
      '/a0-b1-c2/d3-e4-f5/ghi-jkl-mno/pqrstuvwxyz': {},
      '/foo/{$#@&^}:bar-baz': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
