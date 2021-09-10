const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-version-convention');
  return linter;
});

test('az-version-convention should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    info: {
      version: '3.0.1',
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('info.version');
  });
});

test('az-version-convention should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    info: {
      version: '2021-07-01',
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-version-convention allows -preview suffix', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    info: {
      version: '2021-07-01-preview',
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
