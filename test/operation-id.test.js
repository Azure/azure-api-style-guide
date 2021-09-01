const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-operation-id');
  return linter;
});

test('az-operation-id should find operationId not Noun_Verb', async () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/api/test1': {
        get: {
          operationId: 'notNounVerb',
        },
        post: {
          operationId: 'fooBarBaz',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(2);
    expect(results[0].path.join('.')).toBe('paths./api/test1.get.operationId');
    expect(results[1].path.join('.')).toBe('paths./api/test1.post.operationId');
    results.forEach((result) => expect(result.message).toContain(
      'OperationId should be of the form "Noun_Verb"',
    ));
  });
});

test('az-operation-id should find operationId without standard verb', async () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/api/test2': {
        get: {
          operationId: 'Noun_Verb',
        },
        put: {
          operationId: 'Noun_Put',
        },
        patch: {
          operationId: 'Noun_Patch',
        },
        delete: {
          operationId: 'Noun_Remove',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(4);
    expect(results[0].path.join('.')).toBe('paths./api/test2.get.operationId');
    expect(results[1].path.join('.')).toBe('paths./api/test2.put.operationId');
    expect(results[2].path.join('.')).toBe('paths./api/test2.patch.operationId');
    expect(results[3].path.join('.')).toBe('paths./api/test2.delete.operationId');
    results.forEach((result) => expect(result.message).toMatch(
      /OperationId for (get|put|patch|delete) method should contain/,
    ));
  });
});

test('az-operation-id should find operationId without standard verb', async () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/api/test3': {
        get: {
          operationId: 'Noun_Get',
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
        put: {
          operationId: 'Noun_Create',
          responses: {
            200: {
              description: 'Success',
            },
            201: {
              description: 'Created',
            },
          },
        },
        patch: {
          operationId: 'Noun_Update',
          responses: {
            200: {
              description: 'Success',
            },
            201: {
              description: 'Created',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(3);
    expect(results[0].path.join('.')).toBe('paths./api/test3.get.operationId');
    expect(results[0].message).toBe('OperationId for get method on a collection should contain "List"');
    expect(results[1].path.join('.')).toBe('paths./api/test3.put.operationId');
    expect(results[1].message).toBe('OperationId for put method should contain both "Create" and "Update"');
    expect(results[2].path.join('.')).toBe('paths./api/test3.patch.operationId');
    expect(results[2].message).toBe('OperationId for patch method should contain both "Create" and "Update"');
  });
});

test('az-operation-id should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/api/test3': {
        get: {
          operationId: 'Noun_Get',
        },
        put: {
          operationId: 'Noun_Create',
        },
        patch: {
          operationId: 'Noun_Update',
        },
        delete: {
          operationId: 'Noun_Delete',
        },
        post: {
          operationId: 'Noun_Anything',
        },
      },
      '/api/test4': {
        get: {
          operationId: 'Noun_List',
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
        put: {
          operationId: 'Noun_CreateOrUpdate',
          responses: {
            200: {
              description: 'Success',
            },
            201: {
              description: 'Created',
            },
          },
        },
        patch: {
          operationId: 'Noun_CreateOrUpdate',
          responses: {
            200: {
              description: 'Success',
            },
            201: {
              description: 'Created',
            },
          },
        },
      },
      '/api/test5': {
        get: {
          operationId: 'noun_get',
        },
        put: {
          operationId: 'noun_create',
        },
        patch: {
          operationId: 'noun_update',
        },
        delete: {
          operationId: 'noun_delete',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
