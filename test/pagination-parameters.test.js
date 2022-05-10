/* eslint-disable object-curly-newline */
const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-pagination-parameters');
  return linter;
});

test('az-pagination-parameters should find errors in top parameter', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          parameters: [{ name: 'top', in: 'query', type: 'string' }],
        },
      },
      '/test2': {
        get: {
          parameters: [{ name: 'top', in: 'query', type: 'integer', required: true }],
        },
      },
      '/test3': {
        post: {
          parameters: [{ name: 'top', in: 'query', type: 'integer', default: 100 }],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./test1.get.parameters.0.type');
    expect(results[1].path.join('.')).toBe('paths./test2.get.parameters.0.required');
    expect(results[2].path.join('.')).toBe('paths./test3.post.parameters.0.default');
  });
});

test('az-pagination-parameters should find errors in skip parameter', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          parameters: [{ name: 'skip', in: 'query', type: 'string', default: 0 }],
        },
      },
      '/test2': {
        get: {
          parameters: [{ name: 'skip', in: 'query', type: 'integer', default: 0, required: true }],
        },
      },
      '/test3': {
        post: {
          parameters: [{ name: 'skip', in: 'query', type: 'integer', default: 100 }],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./test1.get.parameters.0.type');
    expect(results[1].path.join('.')).toBe('paths./test2.get.parameters.0.required');
    expect(results[2].path.join('.')).toBe('paths./test3.post.parameters.0.default');
  });
});

test('az-pagination-parameters should find errors in maxpagesize parameter', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test0': {
        get: {
          parameters: [{ name: 'maxPageSize', in: 'query', type: 'integer' }],
        },
      },
      '/test1': {
        get: {
          parameters: [{ name: 'maxpagesize', in: 'query', type: 'string' }],
        },
      },
      '/test2': {
        get: {
          parameters: [{ name: 'maxpagesize', in: 'query', type: 'integer', required: true }],
        },
      },
      '/test3': {
        post: {
          parameters: [{ name: 'maxpagesize', in: 'query', type: 'integer', default: 100 }],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4);
    expect(results[0].path.join('.')).toBe('paths./test0.get.parameters.0.name');
    expect(results[1].path.join('.')).toBe('paths./test1.get.parameters.0.type');
    expect(results[2].path.join('.')).toBe('paths./test2.get.parameters.0.required');
    expect(results[3].path.join('.')).toBe('paths./test3.post.parameters.0.default');
  });
});

test('az-pagination-parameters should find errors in filter parameter', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          parameters: [{ name: 'filter', in: 'query', type: 'integer' }],
        },
      },
      '/test2': {
        get: {
          parameters: [{ name: 'filter', in: 'query', type: 'string', required: true }],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./test1.get.parameters.0.type');
    expect(results[1].path.join('.')).toBe('paths./test2.get.parameters.0.required');
  });
});

test('az-pagination-parameters should find errors in orderby parameter', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test0': {
        get: {
          parameters: [{ name: 'orderBy', in: 'query', type: 'array', items: { type: 'string' } }],
        },
      },
      '/test1': {
        get: {
          parameters: [{ name: 'orderby', in: 'query', type: 'string' }],
        },
      },
      '/test2': {
        get: {
          parameters: [{ name: 'orderby', in: 'query', type: 'array', items: { type: 'string' }, required: true }],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./test0.get.parameters.0.name');
    expect(results[1].path.join('.')).toBe('paths./test1.get.parameters.0.type');
    expect(results[2].path.join('.')).toBe('paths./test2.get.parameters.0.required');
  });
});

// Test for errors in the select parameter
test('az-pagination-parameters should find errors in select parameter', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          parameters: [{ name: 'select', in: 'query', type: 'integer' }],
        },
      },
      '/test2': {
        get: {
          parameters: [{ name: 'select', in: 'query', type: 'array', items: { type: 'string' }, required: true }],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./test1.get.parameters.0.type');
    expect(results[1].path.join('.')).toBe('paths./test2.get.parameters.0.required');
  });
});

// Test for errors in the expand parameter
test('az-pagination-parameters should find errors in expand parameter', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          parameters: [{ name: 'expand', in: 'query', type: 'integer' }],
        },
      },
      '/test2': {
        get: {
          parameters: [{ name: 'expand', in: 'query', type: 'array', items: { type: 'string' }, required: true }],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./test1.get.parameters.0.type');
    expect(results[1].path.join('.')).toBe('paths./test2.get.parameters.0.required');
  });
});

test('az-pagination-parameters should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          parameters: [
            { name: 'top', in: 'query', type: 'integer' },
            { name: 'skip', in: 'query', type: 'integer', default: 0 },
            { name: 'maxpagesize', in: 'query', type: 'integer' },
            { name: 'filter', in: 'query', type: 'string' },
            { name: 'select', in: 'query', type: 'array', items: { type: 'string' } },
            { name: 'expand', in: 'query', type: 'array', items: { type: 'string' } },
            { name: 'orderby', in: 'query', type: 'array', items: { type: 'string' } },
          ],
        },
      },
      '/test2': {
        post: {
          parameters: [
            { name: 'top', in: 'query', type: 'integer' },
            { name: 'skip', in: 'query', type: 'integer', default: 0 },
            { name: 'maxpagesize', in: 'query', type: 'integer' },
            { name: 'filter', in: 'query', type: 'string' },
            { name: 'select', in: 'query', type: 'array', items: { type: 'string' } },
            { name: 'expand', in: 'query', type: 'array', items: { type: 'string' } },
            { name: 'orderby', in: 'query', type: 'array', items: { type: 'string' } },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
