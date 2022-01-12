const URL_MAX_LENGTH = 2083;

// `given` is a (resolved) parameter entry at the path or operation level
module.exports = (param, _opts, paths) => {
  if (param === null || typeof param !== 'object') {
    return [];
  }

  const path = paths.path || paths.target || [];

  // These errors will be caught elsewhere, so silently ignore here
  if (!param.in || !param.name) {
    return [];
  }

  const errors = [];

  // If the parameter contains a schema, then this must be oas3
  const isOas3 = !!param.schema;

  const schema = isOas3 ? param.schema : param;
  if (isOas3) {
    path.push('schema');
  }

  if (schema.type !== 'string') {
    errors.push({
      message: 'Path parameter should be defined as type: string.',
      path: [...path, 'type'],
    });
  }

  if (!schema.maxLength && !schema.pattern) {
    errors.push({
      message: 'Path parameter should specify a maximum length (maxLength) and characters allowed (pattern).',
      path,
    });
  } else if (!schema.maxLength) {
    errors.push({
      message: 'Path parameter should specify a maximum length (maxLength).',
      path,
    });
  } else if (schema.maxLength && schema.maxLength >= URL_MAX_LENGTH) {
    errors.push({
      message: `Path parameter maximum length should be less than ${URL_MAX_LENGTH}`,
      path,
    });
  } else if (!schema.pattern) {
    errors.push({
      message: 'Path parameter should specify characters allowed (pattern).',
      path,
    });
  }

  return errors;
};
