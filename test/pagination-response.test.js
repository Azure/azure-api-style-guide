const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-pagination-response');
  return linter;
});

test('az-pagination-response should find missing x-ms-pageable extension', async () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                },
              },
            },
          },
        },
        post: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./test1.get');
    expect(results[0].message).toBe('Operation might be pageable. Consider adding the x-ms-pageable extension.');
    expect(results[1].path.join('.')).toBe('paths./test1.post');
    expect(results[1].message).toBe('Operation might be pageable. Consider adding the x-ms-pageable extension.');
  });
});

test('az-pagination-response should find errors in value property', async () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test2': {
        get: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'string',
                  },
                  nextLink: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
      },
      '/test3': {
        get: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextLink: {
                    type: 'string',
                  },
                },
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
      },
      '/test4': {
        get: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  values: {
                    type: 'array',
                  },
                  nextLink: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./test2.get.responses.200.schema.properties.value.type');
    expect(results[0].message).toBe('`value` property in pageable response should be type: array');
    expect(results[1].path.join('.')).toBe('paths./test3.get.responses.200.schema');
    expect(results[1].message).toBe('`value` property in pageable response should be required');
    expect(results[2].path.join('.')).toBe('paths./test4.get.responses.200.schema.properties');
    expect(results[2].message).toBe('Response body schema of pageable response should contain top-level array property `value`');
  });
});

test('az-pagination-response should find errors in nextLink property', async () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test5': {
        get: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextLink: {
                    type: 'object',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
      },
      '/test6': {
        get: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextPage: {
                    type: 'string',
                  },
                },
                required: ['value', 'nextPage'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextPage',
          },
        },
      },
      '/test7': {
        get: {
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextPage: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: null,
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./test5.get.responses.200.schema.properties.nextLink.type');
    expect(results[0].message).toBe('`nextLink` property in pageable response should be type: string');
    expect(results[1].path.join('.')).toBe('paths./test6.get.responses.200.schema.required');
    expect(results[1].message).toBe('`nextPage` property in pageable response should be optional.');
    expect(results[2].path.join('.')).toBe('paths./test7.get.responses.200.schema.properties');
    expect(results[2].message).toBe('Response body schema of pageable response should contain top-level property `nextLink`');
  });
});

test('az-pagination-response should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/good-path': {
        get: {
          operationId: 'Good_List',
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextLink: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
      },
      '/good-path2': {
        get: {
          operationId: 'Good_List2',
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextLink: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: null,
          },
        },
      },
      '/good-path3': {
        get: {
          operationId: 'Good_List3',
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextPage: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextPage',
          },
        },
      },
      '/good-path4': {
        get: {
          operationId: 'Good_NotList',
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  this: {
                    type: 'string',
                  },
                  that: {
                    type: 'string',
                  },
                  theOther: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
