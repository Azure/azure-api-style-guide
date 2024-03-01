// The put request and response body should be the same.

// "given" is a put operation object.
// This function assumes it is running on an unresolved doc.
module.exports = (putOperation, _opts, paths) => {
  if (putOperation === null || typeof putOperation !== 'object') {
    return [];
  }
  const path = paths.path || paths.target || [];

  const errors = [];

  // resource schema is create operation response schema
  const responseBodyRef = putOperation.responses?.['201']?.schema?.$ref
                          || putOperation.responses?.['200']?.schema?.$ref;
  const requestBodyRef = putOperation.parameters?.find((param) => param.in === 'body')?.schema?.$ref;

  if (responseBodyRef && requestBodyRef && responseBodyRef !== requestBodyRef) {
    errors.push({
      message: 'A PUT operation should use the same schema for the request and response body.',
      path,
    });
  }

  return errors;
};
