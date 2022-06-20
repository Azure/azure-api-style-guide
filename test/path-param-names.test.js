const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-path-parameter-names');
  return linter;
});

test('az-path-parameter-names should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/foo/{p1}': {},
      '/foo/{p2}/bar/{p3}': {},
      '/bar/{p4}': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./foo/{p2}/bar/{p3}');
    expect(results[0].message).toContain('Inconsistent parameter names "p1" and "p2" for path segment "foo".');
    expect(results[1].path.join('.')).toBe('paths./bar/{p4}');
    expect(results[1].message).toContain('Inconsistent parameter names "p3" and "p4" for path segment "bar".');
  });
});

test('az-path-parameter-names should find a static path segment that is followed by two different path params', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/foo/{p1}': {},
      '/bar/{p1}/baz/{p2}': {},
      '/qux/{p2}': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./bar/{p1}/baz/{p2}');
    expect(results[0].message).toContain('Inconsistent path segments "foo" and "bar" for parameter "p1"');
    expect(results[1].path.join('.')).toBe('paths./qux/{p2}');
    expect(results[1].message).toContain('Inconsistent path segments "baz" and "qux" for parameter "p2"');
  });
});

test('az-path-parameter-names should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/foo/{p1}': {},
      '/foo/{p1}/bar/{p2}': {},
      '/bar/{p2}': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-path-parameter-names should find oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0',
    paths: {
      '/foo/{p1}': {},
      '/foo/{p2}/bar/{p3}': {},
      '/bar/{p4}': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./foo/{p2}/bar/{p3}');
    expect(results[0].message).toContain('Inconsistent parameter names "p1" and "p2" for path segment "foo".');
    expect(results[1].path.join('.')).toBe('paths./bar/{p4}');
    expect(results[1].message).toContain('Inconsistent parameter names "p3" and "p4" for path segment "bar".');
  });
});

test('az-path-parameter-names should find no oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0',
    paths: {
      '/foo/{p1}': {},
      '/foo/{p1}/bar/{p2}': {},
      '/bar/{p2}': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
