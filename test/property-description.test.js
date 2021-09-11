const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-property-description');
  return linter;
});

// Test for missing property description in
// - inline body parameter schema
// - inline response body schema
// - top-level schema in definitions
// - inner schema in definitions

test('az-property-description should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          parameters: [
            {
              name: 'version',
              in: 'body',
              schema: {
                type: 'object',
                properties: {
                  prop1: {
                    type: 'string',
                  },
                  prop2: {
                    type: 'object',
                    properties: {
                      prop3: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                type: 'object',
                properties: {
                  propA: {
                    type: 'string',
                  },
                  propB: {
                    type: 'object',
                    properties: {
                      propC: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    definitions: {
      Model1: {
        type: 'object',
        properties: {
          propW: {
            type: 'string',
          },
          propX: {
            type: 'object',
            properties: {
              propY: {
                type: 'string',
              },
            },
          },
          propZ: {
            $ref: '#/definitions/PropZ',
          },
        },
      },
      PropZ: {
        type: 'string',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(9);
    expect(results[0].path.join('.')).toBe('paths./test1.post.parameters.0.schema.properties.prop1');
    expect(results[1].path.join('.')).toBe('paths./test1.post.parameters.0.schema.properties.prop2');
    expect(results[2].path.join('.')).toBe('paths./test1.post.parameters.0.schema.properties.prop2.properties.prop3');
    expect(results[3].path.join('.')).toBe('paths./test1.post.responses.200.schema.properties.propA');
    expect(results[4].path.join('.')).toBe('paths./test1.post.responses.200.schema.properties.propB');
    expect(results[5].path.join('.')).toBe('paths./test1.post.responses.200.schema.properties.propB.properties.propC');
    expect(results[6].path.join('.')).toBe('definitions.Model1.properties.propW');
    expect(results[7].path.join('.')).toBe('definitions.Model1.properties.propX');
    expect(results[8].path.join('.')).toBe('definitions.Model1.properties.propX.properties.propY');
  });
});

test('az-property-description should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          parameters: [
            {
              name: 'version',
              in: 'body',
              schema: {
                type: 'object',
                properties: {
                  prop1: {
                    type: 'string',
                    description: 'prop1',
                  },
                  prop2: {
                    type: 'object',
                    description: 'prop2',
                    properties: {
                      prop3: {
                        type: 'string',
                        description: 'prop3',
                      },
                    },
                  },
                },
              },
            },
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                type: 'object',
                properties: {
                  propA: {
                    type: 'string',
                    description: 'propA',
                  },
                  propB: {
                    type: 'object',
                    description: 'propB',
                    properties: {
                      propC: {
                        type: 'string',
                        description: 'propC',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    definitions: {
      Model1: {
        type: 'object',
        properties: {
          propW: {
            type: 'string',
            description: 'propW',
          },
          propX: {
            type: 'object',
            description: 'propX',
            properties: {
              propY: {
                type: 'string',
                description: 'propY',
              },
            },
          },
          propZ: {
            $ref: '#/definitions/PropZ',
          },
        },
      },
      PropZ: {
        type: 'string',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
