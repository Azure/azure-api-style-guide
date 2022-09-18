// Check conformance to Azure operationId conventions:
// - operationIds should have the form "noun_verb" with just one underscore separator [R1001, R2055]
// - get operation on a collection should have "list" in the operationId verb
// - get operation on a single instance should have "get" in the operationId verb
// - put operation that returns 201 should have "create" in the operationId verb
// - put operation that returns 200 should have "replace" in the operationId verb
// - put operation that returns 200 should not have "update" in the operationId verb
// - patch operation that returns 201 should have "create" in the operationId verb
// - patch operation that returns 200 should have "update" in the operationId verb
// - patch operation should not have "patch" in the operationId verb
// - post operation should not have "post" in the operationId verb
// - delete operation should have "delete" in the operationId verb

module.exports = (operation, _opts, paths) => {
  // targetVal should be an operation
  if (operation === null || typeof operation !== 'object') {
    return [];
  }
  const path = paths.path || paths.target || [];

  const errors = [];

  if (!operation.operationId) {
    // Missing operationId is caught elsewhere, so just return
    return errors;
  }

  const m = operation.operationId.match(/[A-Za-z0-9]+_([A-Za-z0-9]+)/);
  if (!m) {
    errors.push({
      message: 'OperationId should be of the form "Noun_Verb"',
      path: [...path, 'operationId'],
    });
  }

  const verb = m ? m[1] : operation.operationId;
  const method = path[path.length - 1];
  const statusCodes = operation.responses ? Object.keys(operation.responses) : [];

  if (method === 'get') {
    const opPath = path[path.length - 2];
    const pathIsCollection = !opPath.endsWith('}');
    if (pathIsCollection) {
      if (!verb.match(/list/i)) {
        errors.push({
          message: 'OperationId for get on a collection should contain "list"',
          path: [...path, 'operationId'],
        });
      }
    } else if (!verb.match(/get/i)) {
      errors.push({
        message: 'OperationId for get on a single object should contain "get"',
        path: [...path, 'operationId'],
      });
    }
  } else if (method === 'put') {
    if (statusCodes.includes('200') && statusCodes.includes('201')) {
      if (!verb.match(/create/i) || !verb.match(/replace/i)) {
        errors.push({
          message: 'OperationId for put with 200 and 201 responses should contain "create" and "replace"',
          path: [...path, 'operationId'],
        });
      }
    } else if (statusCodes.includes('200') && !statusCodes.includes('201')) {
      if (!verb.match(/replace/i)) {
        errors.push({
          message: 'OperationId for put with 200 response should contain "replace"',
          path: [...path, 'operationId'],
        });
      }
      if (verb.match(/create/i)) {
        errors.push({
          message: 'OperationId for put without 201 response should not contain "create"',
          path: [...path, 'operationId'],
        });
      }
    } else if (statusCodes.includes('201') && !statusCodes.includes('200')) {
      if (!verb.match(/create/i)) {
        errors.push({
          message: 'OperationId for put with 201 response should contain "create"',
          path: [...path, 'operationId'],
        });
      }
      if (verb.match(/replace/i)) {
        errors.push({
          message: 'OperationId for put without 200 response should not contain "replace"',
          path: [...path, 'operationId'],
        });
      }
    }

    // Anti-patterns

    // operationId for put should not contain "update"
    const update = verb.match(/update/i)?.[0];
    if (update) {
      errors.push({
        message: `OperationId for put should not contain "${update}"`,
        path: [...path, 'operationId'],
      });
    }

    // operationId for put should not contain "put"
    const put = verb.match(/put/i)?.[0];
    if (put) {
      errors.push({
        message: `OperationId for put should not contain "${put}"`,
        path: [...path, 'operationId'],
      });
    }
  } else if (method === 'patch') {
    if (statusCodes.includes('200') && statusCodes.includes('201')) {
      if (!verb.match(/create/i) || !verb.match(/update/i)) {
        errors.push({
          message: 'OperationId for patch with 200 and 201 responses should contain "create" and "update"',
          path: [...path, 'operationId'],
        });
      }
    } else if (statusCodes.includes('200') && !statusCodes.includes('201')) {
      if (!verb.match(/update/i)) {
        errors.push({
          message: 'OperationId for patch with 200 response should contain "update"',
          path: [...path, 'operationId'],
        });
      }
      if (verb.match(/create/i)) {
        errors.push({
          message: 'OperationId for patch without 201 response should not contain "create"',
          path: [...path, 'operationId'],
        });
      }
    } else if (statusCodes.includes('201') && !statusCodes.includes('200')) {
      if (!verb.match(/create/i)) {
        errors.push({
          message: 'OperationId for patch with 201 response should contain "create"',
          path: [...path, 'operationId'],
        });
      }
      if (verb.match(/update/i)) {
        errors.push({
          message: 'OperationId for patch without 200 response should not contain "update"',
          path: [...path, 'operationId'],
        });
      }
    }

    // Anti-patterns

    // operationId for patch should not contain "patch"
    const patch = verb.match(/patch/i)?.[0];
    if (patch) {
      errors.push({
        message: `OperationId for patch should not contain "${patch}"`,
        path: [...path, 'operationId'],
      });
    }
  } else if (method === 'post') {
    // operationId for post should not contain "post"
    const post = verb.match(/post/i)?.[0];
    if (post) {
      errors.push({
        message: `OperationId for post should not contain "${post}"`,
        path: [...path, 'operationId'],
      });
    }
  } else if (method === 'delete') {
    if (!verb.match(/delete/i)) {
      errors.push({
        message: 'OperationId for delete should contain "delete"',
        path: [...path, 'operationId'],
      });
    }
  }

  return errors;
};
