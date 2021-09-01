const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-path-characters');
  return linter;
});

test('az-path-characters should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/api[]': {},
      '/foo:bar/{baz}': {},
      '/foo/{bar}:baz/qux': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths' /* ./api[]' */);
    expect(results[1].path.join('.')).toBe('paths./foo:bar/{baz}');
    expect(results[2].path.join('.')).toBe('paths./foo/{bar}:baz/qux');
  });
});

test('az-path-characters should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/abcdefghijklmnopqrstuvwxyz0123456789': {},
      '/A0.B1.C2/D3_E4_F5/GHI-JKL-MNO/~PQRSTUVWXYZ': {},
      '/foo/{$#@&^}:goo': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
