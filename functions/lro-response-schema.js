// Check conformance to Azure guidelines for 202 responses:
// - A 202 response should have a response body schema
// - The response body schema should contain `id`, `status`, and `error` properties.
// - The `id`, `status`, and `error` properties should be required.
// - The `id` property should be type: string.
// - The `status` property should be type: string and enum with values:
//   - "Running", "Succeeded", "Failed", "Cancelled".
// - The `error` property should be type: object and not required.

// Rule target is a 202 response
module.exports = (lroResponse, _opts, context) => {
  // defensive programming - make sure we have an object
  if (lroResponse === null || typeof lroResponse !== 'object') {
    return [];
  }

  const lroResponseSchema = lroResponse.schema;

  // A 202 response should include a schema for the operation status monitor.
  if (!lroResponseSchema) {
    return [{
      message: 'A 202 response should include a schema for the operation status monitor.',
      path: context.path || [],
    }];
  }

  const path = [...(context.path || []), 'schema'];

  const errors = [];

  // - The `id`, `status`, and `error` properties should be required.
  const requiredProperties = new Set(lroResponseSchema.required || []);
  const checkRequiredProperty = (prop) => {
    if (!requiredProperties.has(prop)) {
      errors.push({
        message: `\`${prop}\` property in LRO response should be required`,
        path: [...path, 'required'],
      });
    }
  };

  // Check id property
  if (lroResponseSchema.properties && 'id' in lroResponseSchema.properties) {
    if (lroResponseSchema.properties.id.type !== 'string') {
      errors.push({
        message: '\'id\' property in LRO response should be type: string',
        path: [...path, 'properties', 'id', 'type'],
      });
    }
    checkRequiredProperty('id');
  } else {
    errors.push({
      message: 'LRO response should contain top-level property `id`',
      path: [...path, 'properties'],
    });
  }

  // Check status property
  if (lroResponseSchema.properties && 'status' in lroResponseSchema.properties) {
    if (lroResponseSchema.properties.status.type !== 'string') {
      errors.push({
        message: '`status` property in LRO response should be type: string',
        path: [...path, 'properties', 'status', 'type'],
      });
    }
    checkRequiredProperty('status');
    const statusValues = new Set(lroResponseSchema.properties.status.enum || []);
    const requiredStatusValues = ['Running', 'Succeeded', 'Failed', 'Canceled'];
    if (!requiredStatusValues.every((value) => statusValues.has(value))) {
      errors.push({
        message: `'status' property enum in LRO response should contain values: ${requiredStatusValues.join(', ')}`,
        path: [...path, 'properties', 'status', 'enum'],
      });
    }
  } else {
    errors.push({
      message: 'LRO response should contain top-level property `status`',
      path: [...path, 'properties'],
    });
  }

  // Check error property
  if (lroResponseSchema.properties && 'error' in lroResponseSchema.properties) {
    if (lroResponseSchema.properties.error.type !== 'object') {
      errors.push({
        message: '`error` property in LRO response should be type: object',
        path: [...path, 'properties', 'error', 'type'],
      });
    }
    if (requiredProperties.has('error')) {
      errors.push({
        message: '`error` property in LRO response should not be required',
        path: [...path, 'required'],
      });
    }
  } else {
    errors.push({
      message: 'LRO response should contain top-level property `error`',
      path: [...path, 'properties'],
    });
  }

  return errors;
};
