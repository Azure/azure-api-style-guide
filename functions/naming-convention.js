// Check naming convention.

// options:
//   type: 'boolean' | 'date-time'
//   match: RegExp
//   notMatch: RegExp

/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

const { pattern } = require('@stoplight/spectral-functions');

function isBooleanSchema(schema) {
  return schema.type === 'boolean';
}

function isDateTimeSchema(schema) {
  return schema.type === 'string' && schema.format === 'date-time';
}

function isSchemaType(type) {
  switch (type) {
    case 'boolean': return isBooleanSchema;
    case 'date-time': return isDateTimeSchema;
    default: return (_) => false;
  }
}

// Check all property names in the schema comply with the naming convention.
function propertyNamingConvention(schema, options, path) {
  const errors = [];

  const { type, ...patternOpts } = options;
  const isType = isSchemaType(type);

  // Check property names
  for (const name of schema.properties ? Object.keys(schema.properties) : []) {
    if (isType(schema.properties[name]) && pattern(name, patternOpts)) {
      errors.push({
        message: `property "${name}" does not follow ${options.type} naming convention`,
        path: [...path, 'properties', name],
      });
    }
  }

  if (schema.items) {
    errors.push(
      ...propertyNamingConvention(schema.items, options, [...path, 'items']),
    );
  }

  for (const applicator of ['allOf', 'anyOf', 'oneOf']) {
    if (schema[applicator] && Array.isArray(schema[applicator])) {
      for (const [index, value] of schema[applicator].entries()) {
        errors.push(
          ...propertyNamingConvention(value, options, [...path, applicator, index]),
        );
      }
    }
  }

  return errors;
}

// input is ignored -- we take the whole document as input
// Rule is run on resolved doc.
module.exports = (input, options, _context) => {
  const oasDoc = input;

  const oas2 = oasDoc.swagger === '2.0';
  const oas3 = oasDoc.openapi?.startsWith('3.') || false;

  const { type, ...patternOpts } = options;
  const isType = isSchemaType(type);

  const errors = [];

  // Check all property names in the schema comply with the naming convention.
  for (const pathKey of Object.keys(oasDoc.paths)) {
    const pathItem = oasDoc.paths[pathKey];
    for (const opMethod of ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']) {
      if (pathItem[opMethod]) {
        const op = pathItem[opMethod];

        // Processing for oas2 documents
        if (oas2) {
          // Check the oas2 parameters
          for (let i = 0; i < op.parameters?.length || 0; i += 1) {
            const param = op.parameters[i];
            if (param.in !== 'body' && isType(param) && pattern(param.name, patternOpts)) {
              errors.push({
                message: `parameter "${param.name}" does not follow ${options.type} naming convention`,
                path: ['paths', pathKey, opMethod, 'parameters', i, 'name'],
              });
            }
          }
          // Check the oas2 body parameter
          const bodyParam = op.parameters?.find((p) => p.in === 'body');
          if (bodyParam) {
            const bodyIndex = op.parameters.indexOf(bodyParam);
            errors.push(
              ...propertyNamingConvention(bodyParam.schema, options, ['paths', pathKey, opMethod, 'parameters', bodyIndex, 'schema']),
            );
          }
          // Check the oas2 responses
          for (const [responseKey, response] of Object.entries(op.responses)) {
            if (response.schema) {
              errors.push(
                ...propertyNamingConvention(response.schema, options, ['paths', pathKey, opMethod, 'responses', responseKey, 'schema']),
              );
            }
          }
        }

        // Processing for oas3 documents
        if (oas3) {
          // Check the oas3 parameters
          for (let i = 0; i < op.parameters?.length || 0; i += 1) {
            const param = op.parameters[i];
            if (param.schema && isType(param.schema) && pattern(param.name, patternOpts)) {
              errors.push({
                message: `parameter "${param.name}" does not follow ${options.type} naming convention`,
                path: ['paths', pathKey, opMethod, 'parameters', i, 'name'],
              });
            }
          }
          // Check the oas3 requestBody
          if (op.requestBody?.content) {
            for (const [contentTypeKey, contentType] of Object.entries(op.requestBody.content)) {
              if (contentType.schema) {
                errors.push(
                  ...propertyNamingConvention(contentType.schema, options, ['paths', pathKey, opMethod, 'requestBody', 'content', contentTypeKey, 'schema']),
                );
              }
            }
          }

          // Check the oas3 responses
          if (op.responses) {
            for (const [responseKey, response] of Object.entries(op.responses)) {
              if (response.content) {
                for (const [contentTypeKey, contentType] of Object.entries(response.content)) {
                  if (contentType.schema) {
                    errors.push(
                      ...propertyNamingConvention(contentType.schema, options, ['paths', pathKey, opMethod, 'responses', responseKey, 'content', contentTypeKey, 'schema']),
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return errors;
};
