// Check conformance to Azure guidelines for paginated responses:
// - The operation should have the `x-ms-pageable` annotation [R2029]
// - The response should contain a top-level `value` property of type array and required
// - The response should contain a top-level `nextLink` property of type string and optional [R4012]

module.exports = (operation, _opts, paths) => {
  // operation should be a get or post operation
  if (operation === null || typeof operation !== 'object') {
    return [];
  }
  const path = paths.path || [];

  // responses is required property of an operation in OpenAPI 2.0, so if
  // isn't present this will be flagged elsewhere -- just return;
  if (!operation.responses || typeof operation.responses !== 'object') {
    return [];
  }

  // Find success response code
  const resp = Object.keys(operation.responses)
    .find((code) => code.startsWith('2'));

  // No success response will be flagged elsewhere, just return
  if (!resp) {
    return [];
  }

  // Get the schema of the success response
  const responseSchema = operation.responses[resp].schema || {};

  const errors = [];

  if (operation['x-ms-pageable']) {
    // Check value property
    if ('value' in responseSchema.properties) {
      if (responseSchema.properties.value.type !== 'array') {
        errors.push({
          message: '`value` property in pageable response should be type: array',
          path: [...path, 'responses', resp, 'schema', 'properties', 'value', 'type'],
        });
      }
      if (!(responseSchema.required?.includes('value'))) {
        errors.push({
          message: '`value` property in pageable response should be required',
          path: [...path, 'responses', resp, 'schema', 'required'],
        });
      }
    } else {
      errors.push({
        message: 'Response body schema of pageable response should contain top-level array property `value`',
        path: [...path, 'responses', resp, 'schema', 'properties'],
      });
    }
    // Check nextLink property
    const nextLinkName = operation['x-ms-pageable'].nextLinkName || 'nextLink';
    if (nextLinkName in responseSchema.properties) {
      if (responseSchema.properties[nextLinkName].type !== 'string') {
        errors.push({
          message: `\`${nextLinkName}\` property in pageable response should be type: string`,
          path: [...path, 'responses', resp, 'schema', 'properties', nextLinkName, 'type'],
        });
      }
      if (responseSchema.required?.includes(nextLinkName)) {
        errors.push({
          message: `\`${nextLinkName}\` property in pageable response should be optional.`,
          path: [...path, 'responses', resp, 'schema', 'required'],
        });
      }
    } else {
      errors.push({
        message: `Response body schema of pageable response should contain top-level property \`${nextLinkName}\``,
        path: [...path, 'responses', resp, 'schema', 'properties'],
      });
    }
  } else {
    const responseHasArray = Object.values(responseSchema.properties || {})
      .some((prop) => prop.type === 'array');

    // Why 3? [value, nextLink, count]
    if (responseHasArray && Object.keys(responseSchema.properties).length <= 3) {
      errors.push({
        message: 'Operation might be pageable. Consider adding the x-ms-pageable extension.',
        path,
      });
    }
  }

  return errors;
};
