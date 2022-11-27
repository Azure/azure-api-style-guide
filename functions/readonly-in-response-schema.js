// Flag any properties that are readonly in the response schema.

// Scan an OpenAPI document to determine if a schema is a response-only schema,
// which means it is not references by any request schemas.
// Any schema that is referenced by a request is considered a request schema.
// Any schema referenced by a request schema is also considered a request schema.
// Any schema that is not a request schema is considered a response-only schema.

let requestSchemas;

function getRequestSchemas(oasDoc) {
  /* eslint-disable object-curly-newline,object-curly-spacing */
  const getOps = ({put, post, patch}) => [put, post, patch];
  const topLevelRequestSchemas = Object.values(oasDoc.paths || {})
    .flatMap(getOps).filter(Boolean)
    .flatMap(({parameters}) => parameters.filter(({in: location}) => location === 'body'))
    .flatMap(({schema}) => (schema ? [schema] : []))
    .filter(({$ref}) => $ref && $ref.match(/^#\/definitions\//))
    .map(({$ref}) => $ref.replace(/^#\/definitions\//, ''));
  /* eslint-enable object-curly-newline,object-curly-spacing */

  requestSchemas = new Set();

  // Now that we have the top-level response schemas, we need to find all the
  // schemas that are referenced by those schemas. We do this by iterating
  // over the schemas until we find no new schemas to add to the set.
  const schemasToProcess = [...topLevelRequestSchemas];
  while (schemasToProcess.length > 0) {
    const schemaName = schemasToProcess.pop();
    requestSchemas.add(schemaName);
    const schema = oasDoc.definitions[schemaName];
    if (schema) {
      if (schema.properties) {
        // eslint-disable-next-line no-restricted-syntax
        for (const property of Object.values(schema.properties)) {
          if (property.$ref && property.$ref.match(/^#\/definitions\//)) {
            const ref = property.$ref.replace(/^#\/definitions\//, '');
            if (!requestSchemas.has(ref) && !schemasToProcess.includes(ref)) {
              schemasToProcess.push(ref);
            }
          }
          if (property.items && property.items.$ref && property.items.$ref.match(/^#\/definitions\//)) {
            const ref = property.items.$ref.replace(/^#\/definitions\//, '');
            if (!requestSchemas.has(ref) && !schemasToProcess.includes(ref)) {
              schemasToProcess.push(ref);
            }
          }
          if (property.additionalProperties && property.additionalProperties.$ref && property.additionalProperties.$ref.match(/^#\/definitions\//)) {
            const ref = property.additionalProperties.$ref.replace(/^#\/definitions\//, '');
            if (!requestSchemas.has(ref) && !schemasToProcess.includes(ref)) {
              schemasToProcess.push(ref);
            }
          }
        }
      }
      if (schema.allOf) {
        // eslint-disable-next-line no-restricted-syntax
        for (const element of schema.allOf) {
          if (element.$ref && element.$ref.match(/^#\/definitions\//)) {
            const ref = element.$ref.replace(/^#\/definitions\//, '');
            if (!requestSchemas.has(ref) && !schemasToProcess.includes(ref)) {
              schemasToProcess.push(ref);
            }
          }
        }
      }
    }
  }
}

// compute a hash for a string
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    /* eslint-disable no-bitwise */
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
    /* eslint-enable no-bitwise */
  }
  return hash;
}

let docHash;

function responseOnlySchema(schemaName, oasDoc) {
  const thisDocHash = hashCode(JSON.stringify(oasDoc));
  if (!requestSchemas || docHash !== thisDocHash) {
    getRequestSchemas(oasDoc);
    docHash = thisDocHash;
  }

  if (requestSchemas.has(schemaName)) {
    return false;
  }

  return true;
}

// `schema` is a (resolved) parameter entry at the path or operation level
module.exports = (schema, _opts, context) => {
  const schemaName = context.path[context.path.length - 1];
  const oasDoc = context.document.data;
  if (!responseOnlySchema(schemaName, oasDoc)) {
    return [];
  }

  // Flag any properties that are readonly in the response schema.

  const errors = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [propertyName, property] of Object.entries(schema.properties || {})) {
    if (property.readOnly) {
      errors.push({
        message: 'Property of response-only schema should not be marked readOnly',
        path: [...context.path, 'properties', propertyName, 'readOnly'],
      });
    }
  }

  return errors;
};
