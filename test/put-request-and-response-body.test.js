const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-put-request-and-response-body');
  return linter;
});

test('az-put-request-and-response-body should find errors', () => {
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
        ],
        put: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              schema: {
                $ref: '#/definitions/This',
              },
            },
          ],
          responses: {
            201: {
              description: 'Created',
              schema: {
                $ref: '#/definitions/That',
              },
            },
          },
        },
      },
    },
    definitions: {
      This: {
        description: 'This',
        type: 'object',
      },
      That: {
        description: 'That',
        type: 'object',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./test1/{id}.put');
    expect(results[0].message).toBe('A PUT operation should use the same schema for the request and response body.');
  });
});

test('az-put-request-and-response-body should find no errors', () => {
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
        ],
        put: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              schema: {
                $ref: '#/definitions/This',
              },
            },
          ],
          responses: {
            201: {
              description: 'Created',
              schema: {
                $ref: '#/definitions/This',
              },
            },
          },
        },
      },
    },
    definitions: {
      This: {
        description: 'This',
        type: 'object',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
