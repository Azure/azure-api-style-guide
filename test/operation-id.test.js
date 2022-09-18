const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-operation-id');
  return linter;
});

test('az-operation-id should find operationId not Noun_Verb', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          operationId: 'ListTests',
        },
        post: {
          operationId: 'fooBarBaz',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(2);
    expect(results[0].path.join('.')).toBe('paths./test1.get.operationId');
    expect(results[1].path.join('.')).toBe('paths./test1.post.operationId');
    results.forEach((result) => expect(result.message).toBe(
      'OperationId should be of the form "Noun_Verb"',
    ));
  });
});

test('az-operation-id should find operationId for get without standard verb', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        get: {
          operationId: 'GetAll',
        },
      },
      '/test2': {
        get: {
          operationId: 'Noun_GetAll',
        },
      },
      '/test2/{id}': {
        get: {
          operationId: 'Noun_Read',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(4);
    expect(results[0].path.join('.')).toBe('paths./test1.get.operationId');
    expect(results[0].message).toBe('OperationId should be of the form "Noun_Verb"');
    expect(results[1].path.join('.')).toBe('paths./test1.get.operationId');
    expect(results[1].message).toBe('OperationId for get on a collection should contain "list"');
    expect(results[2].path.join('.')).toBe('paths./test2.get.operationId');
    expect(results[2].message).toBe('OperationId for get on a collection should contain "list"');
    expect(results[3].path.join('.')).toBe('paths./test2/{id}.get.operationId');
    expect(results[3].message).toBe('OperationId for get on a single object should contain "get"');
  });
});

test('az-operation-id should find operationId for put without standard verb', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{id}': {
        put: {
          operationId: 'CreateNoun',
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
      // 2: should not have Create
      '/test2/{id}': {
        put: {
          operationId: 'Noun_Submit',
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 3: should not have update
      '/test3/{id}': {
        put: {
          operationId: 'Noun_CreateOrReplace',
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 4: should have replace
      '/test4/{id}': {
        put: {
          operationId: 'Noun_Fiddle',
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      // 5: should not have create
      '/test5/{id}': {
        put: {
          operationId: 'Noun_CreateOrReplace',
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      // 6: should not have update
      '/test6/{id}': {
        put: {
          operationId: 'Noun_CreateOrUpdate',
          responses: {
            200: {
              description: 'Ok',
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
    expect(results).toHaveLength(8);
    expect(results[0].path.join('.')).toBe('paths./test1/{id}.put.operationId');
    expect(results[0].message).toBe('OperationId should be of the form "Noun_Verb"');
    expect(results[1].path.join('.')).toBe('paths./test1/{id}.put.operationId');
    expect(results[1].message).toBe('OperationId for put with 200 and 201 responses should contain "create" and "replace"');
    expect(results[2].path.join('.')).toBe('paths./test2/{id}.put.operationId');
    expect(results[2].message).toBe('OperationId for put with 201 response should contain "create"');
    expect(results[3].path.join('.')).toBe('paths./test3/{id}.put.operationId');
    expect(results[3].message).toBe('OperationId for put without 200 response should not contain "replace"');
    expect(results[4].path.join('.')).toBe('paths./test4/{id}.put.operationId');
    expect(results[4].message).toBe('OperationId for put with 200 response should contain "replace"');
    expect(results[5].path.join('.')).toBe('paths./test5/{id}.put.operationId');
    expect(results[5].message).toBe('OperationId for put without 201 response should not contain "create"');
    expect(results[6].path.join('.')).toBe('paths./test6/{id}.put.operationId');
    expect(results[6].message).toBe('OperationId for put with 200 and 201 responses should contain "create" and "replace"');
    expect(results[7].path.join('.')).toBe('paths./test6/{id}.put.operationId');
    expect(results[7].message).toContain('OperationId for put should not contain');
  });
});

test('az-operation-id should find operationId for patch without standard verb', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{id}': {
        patch: {
          operationId: 'CreateNoun',
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
      '/test2/{id}': {
        patch: {
          operationId: 'Noun_Submit',
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      '/test3/{id}': {
        patch: {
          operationId: 'Noun_CreateOrUpdate',
          responses: {
            201: {
              description: 'Created',
            },
          },
        },
      },
      // 4: should have update
      '/test4/{id}': {
        patch: {
          operationId: 'Noun_Swizzle',
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      // 5: should not have create
      '/test5/{id}': {
        patch: {
          operationId: 'Noun_CreateOrUpdate',
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      // 6: should not have update
      '/test6/{id}': {
        patch: {
          operationId: 'Noun_CreateOrUpdate',
          responses: {
            200: {
              description: 'Ok',
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
    expect(results).toHaveLength(6);
    expect(results[0].path.join('.')).toBe('paths./test1/{id}.patch.operationId');
    expect(results[0].message).toBe('OperationId should be of the form "Noun_Verb"');
    expect(results[1].path.join('.')).toBe('paths./test1/{id}.patch.operationId');
    expect(results[1].message).toBe('OperationId for patch with 200 and 201 responses should contain "create" and "update"');
    expect(results[2].path.join('.')).toBe('paths./test2/{id}.patch.operationId');
    expect(results[2].message).toBe('OperationId for patch with 201 response should contain "create"');
    expect(results[3].path.join('.')).toBe('paths./test3/{id}.patch.operationId');
    expect(results[3].message).toBe('OperationId for patch without 200 response should not contain "update"');
    expect(results[4].path.join('.')).toBe('paths./test4/{id}.patch.operationId');
    expect(results[4].message).toBe('OperationId for patch with 200 response should contain "update"');
    expect(results[5].path.join('.')).toBe('paths./test5/{id}.patch.operationId');
    expect(results[5].message).toBe('OperationId for patch without 201 response should not contain "create"');
  });
});

test('az-operation-id should find operationId for delete without standard verb', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{id}': {
        delete: {
          operationId: 'Noun_WhackIt',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(1);
    expect(results[0].path.join('.')).toBe('paths./test1/{id}.delete.operationId');
    expect(results[0].message).toBe('OperationId for delete should contain "delete"');
  });
});

test('az-operation-id should find anti-patterns in put, patch, and post operations', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{id}': {
        put: {
          operationId: 'Noun_PutTheThing',
        },
        patch: {
          operationId: 'Noun_patch',
        },
        post: {
          operationId: 'Noun_PostSearch',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(3);
    expect(results[0].path.join('.')).toBe('paths./test1/{id}.put.operationId');
    expect(results[0].message).toBe('OperationId for put should not contain "Put"');
    expect(results[1].path.join('.')).toBe('paths./test1/{id}.patch.operationId');
    expect(results[1].message).toBe('OperationId for patch should not contain "patch"');
    expect(results[2].path.join('.')).toBe('paths./test1/{id}.post.operationId');
    expect(results[2].message).toBe('OperationId for post should not contain "Post"');
  });
});

test('az-operation-id should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test/{id}': {
        get: {
          operationId: 'Noun_Get',
        },
        put: {
          operationId: 'Noun_Replace',
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
      '/test': {
        get: {
          operationId: 'Noun_List',
        },
        put: {
          operationId: 'Noun_CreateOrReplace',
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
      '/test5/{id}': {
        get: {
          operationId: 'noun_get',
        },
        put: {
          operationId: 'noun_replace',
        },
        patch: {
          operationId: 'noun_update',
        },
        delete: {
          operationId: 'noun_delete',
        },
      },
      '/test6': {
        get: {
          // no operationId
        },
        put: {
          operationId: 'noun_replace',
          200: {
            description: 'Success',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
