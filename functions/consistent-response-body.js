// If put or patch is a create (returns 201), then verify that put, get, and patch response body
// schemas are consistent.

// pathItem should be a [path item object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#pathItemObject).
// This function assumes it is running on a resolved doc.
module.exports = (pathItem, _opts, paths) => {
  if (pathItem === null || typeof pathItem !== 'object') {
    return [];
  }
  const path = paths.target || paths.given;

  const errors = [];

  // resource schema is create operation response schema
  const createResponseSchema = ((op) => op?.responses?.['201']?.schema);
  const resourceSchema = createResponseSchema(pathItem.put) || createResponseSchema(pathItem.patch);
  if (resourceSchema) {
    ['put', 'get', 'patch'].forEach((method) => {
      const responseSchema = pathItem[method]?.responses?.['200']?.schema;
      if (responseSchema && responseSchema !== resourceSchema) {
        errors.push({
          message: 'Response body schema does not match create response body schema.',
          path: [...path, method, 'responses', '200', 'schema'],
        });
      }
    });
  }

  return errors;
};
