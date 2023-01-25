// Check that required properties of a schema do not have a default.

// `input` is the schema of a request or response body
module.exports = function propertyDefaultNotAllowed(schema, options, { path }) {
  if (schema === null || typeof schema !== 'object') {
    return [];
  }

  const errors = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const prop of schema.required || []) {
    if (schema.properties[prop]?.default) {
      errors.push({
        message: `Schema property "${prop}" is required and cannot have a default`,
        path: [...path, 'properties', prop, 'default'],
      });
    }
  }

  if (schema.properties && typeof schema.properties === 'object') {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(schema.properties)) {
      errors.push(
        ...propertyDefaultNotAllowed(value, options, { path: [...path, 'properties', key] }),
      );
    }
  }

  if (schema.items) {
    errors.push(
      ...propertyDefaultNotAllowed(schema.items, options, { path: [...path, 'items'] }),
    );
  }

  if (schema.allOf && Array.isArray(schema.allOf)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [index, value] of schema.allOf.entries()) {
      errors.push(
        ...propertyDefaultNotAllowed(value, options, { path: [...path, 'allOf', index] }),
      );
    }
  }

  return errors;
};
