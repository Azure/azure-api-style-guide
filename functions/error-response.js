/*
 * Custom function to verify that error response conforms to Microsoft Azure API Guidelines.
 *
 * Check that:
 * - For all error responses, validate that:
 *   - the response contains a schema for the response body
 *   - the response body schema conforms to Azure API guidelines
 *   - the response headers contain an `x-ms-error-code` header definition
 * - All 4xx or 5xx responses contain x-ms-error-response: true
 */

function isArraySchema(schema) {
  return schema.type === 'array' || !!schema.items;
}

function isObjectSchema(schema) {
  return schema.type === 'object' || !!schema.properties;
}

function makePath(obj, path) {
  const pathElem = path.shift();
  return (pathElem in obj) ? [pathElem].concat(makePath(obj[pathElem], path)) : [];
}

// Validate that the schema conforms to Microsoft API Guidelines
// https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#7102-error-condition-responses
function validateErrorResponseSchema(errorResponseSchema, pathToSchema) {
  const errors = [];
  // The error response MUST be a single JSON object.
  if (!errorResponseSchema.properties) {
    errors.push({
      message: 'Error response schema must be an object schema.',
      path: pathToSchema,
    });
    return errors;
  }
  // This object MUST have a name/value pair named "error." The value MUST be a JSON object.
  if (!errorResponseSchema.properties.error || !errorResponseSchema.properties.error.properties) {
    errors.push({
      message: 'Error response schema should contain an object property named `error`.',
      path: [...pathToSchema, 'properties', ...makePath(errorResponseSchema.properties, ['error'])],
    });
    return errors;
  }

  // The `error` object should be required (always present)

  if (!errorResponseSchema.required?.includes?.('error')) {
    errors.push({
      message: 'The `error` property in the error response schema should be required.',
      path: [...pathToSchema, ...makePath(errorResponseSchema, ['required'])],
    });
  }

  const errorSchema = errorResponseSchema.properties.error;
  const pathToErrorSchema = [...pathToSchema, 'properties', 'error'];

  // Spectral message dedup will drop all but first message with the same path, so we need
  // combine messages when they would wind up with the same path.

  const hasCode = !!errorSchema.properties.code;
  const hasMessage = !!errorSchema.properties.code;

  if (!hasCode && hasMessage) {
    errors.push({
      message: 'Error schema should contain `code` property.',
      path: [...pathToErrorSchema, 'properties'],
    });
  } else if (hasCode && !hasMessage) {
    errors.push({
      message: 'Error schema should contain `message` property.',
      path: [...pathToErrorSchema, 'properties'],
    });
  } else if (!hasCode && !hasMessage) {
    errors.push({
      message: 'Error schema should contain `code` and `message` properties.',
      path: [...pathToErrorSchema, 'properties'],
    });
  }

  if (hasCode && errorSchema.properties.code.type !== 'string') {
    errors.push({
      message: 'The `code` property of error schema should be type `string`.',
      path: [...pathToErrorSchema, 'properties', 'code', ...makePath(errorSchema.properties.code, ['type'])],
    });
  }

  if (hasMessage && errorSchema.properties.message.type !== 'string') {
    errors.push({
      message: 'The `message` property of error schema should be type `string`.',
      path: [...pathToErrorSchema, 'properties', 'message', ...makePath(errorSchema.properties.message, ['type'])],
    });
  }

  // Check if schema defines `code` and `message` as required

  if (!['code', 'message'].every((prop) => errorSchema.required?.includes?.(prop))) {
    // Either there is no required or it is missing both properties, so report both missing
    errors.push({
      message: 'Error schema should define `code` and `message` properties as required.',
      path: [...pathToErrorSchema, ...makePath(errorSchema, ['required'])],
    });
  } else if (!errorSchema.required.includes('code')) {
    errors.push({
      message: 'Error schema should define `code` property as required.',
      path: [...pathToErrorSchema, 'required'],
    });
  } else if (!errorSchema.required.includes('message')) {
    errors.push({
      message: 'Error schema should define `message` property as required.',
      path: [...pathToErrorSchema, 'required'],
    });
  }

  // The value for the "target" name/value pair is ... the name of the property in error
  if (!!errorSchema.properties.target && errorSchema.properties.target.type !== 'string') {
    errors.push({
      message: 'The `target` property of the error schema should be type `string`.',
      path: [...pathToErrorSchema, 'properties', 'target'],
    });
  }

  // The value for the "details" name/value pair MUST be an array of JSON objects
  if (!!errorSchema.properties.details && !isArraySchema(errorSchema.properties.details)) {
    errors.push({
      message: 'The `details` property of the error schema should be an array.',
      path: [...pathToErrorSchema, 'properties', 'details'],
    });
  }

  // The value for the "innererror" name/value pair MUST be an object
  if (!!errorSchema.properties.innererror && !isObjectSchema(errorSchema.properties.innererror)) {
    errors.push({
      message: 'The `innererror` property of the error schema should be an object.',
      path: [...pathToErrorSchema, 'properties', 'innererror'],
    });
  }

  return errors;
}

function validateErrorResponse(errorResponse, responsePath) {
  const errors = [];

  // The error response schema should conform to Microsoft API Guidelines
  if (!errorResponse.schema) {
    errors.push({
      message: 'Error response should have a schema.',
      path: responsePath,
    });
  } else {
    errors.push(
      ...validateErrorResponseSchema(errorResponse.schema, [...responsePath, 'schema']),
    );
  }

  // The error response should contain a x-ms-error-code header
  if (!errorResponse.headers || !errorResponse.headers['x-ms-error-code']) {
    errors.push({
      message: 'Error response should contain a x-ms-error-code header.',
      path: !errorResponse.headers ? responsePath : [...responsePath, 'headers'],
    });
  }

  return errors;
}

module.exports = function errorResponse(responses, _opts, paths) {
  const errors = [];
  const path = paths.target || paths.given || [];

  // Note: az-default-response rule will flag missing default response
  if (responses.default) {
    errors.push(
      ...validateErrorResponse(responses.default, [...path, 'default']),
    );
  }

  Object.keys(responses).filter((code) => code.match(/[45]\d\d/)).forEach((code) => {
    errors.push(
      ...validateErrorResponse(responses[code], [...path, code]),
    );

    // The error response should contain x-ms-error-response: true
    if (!(responses[code]['x-ms-error-response'])) {
      errors.push({
        message: 'Error response should contain x-ms-error-response.',
        path: [...path, code],
      });
    }
  });

  return errors;
};
