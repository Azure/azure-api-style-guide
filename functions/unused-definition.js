// Check all definitions in the document to see if they are used
// Use the spectral unreferencedReusableObject to find its list of unused definitions,
// and then remove any that `allOf` a used schema.

const { unreferencedReusableObject } = require('@stoplight/spectral-functions');

const isObject = (obj) => obj && typeof obj === 'object';

// given should point to the member holding the potential reusable objects.
module.exports = (given, _, context) => {
  if (!isObject(given)) {
    return [];
  }
  const opts = {
    reusableObjectsLocation: '#/definitions',
  };
  const unreferencedDefinitionErrors = unreferencedReusableObject(given, opts, context);

  const unusedDefinitions = unreferencedDefinitionErrors.map((error) => error.path[1]);

  const allOfsUsedSchema = (schemaName) => {
    const schema = given[schemaName];
    if (!isObject(schema) || !Array.isArray(schema.allOf)) {
      return false;
    }

    return schema.allOf.some((subSchema) => {
      if (!isObject(subSchema) || !subSchema.$ref) {
        return false;
      }

      const reffedSchema = subSchema.$ref.split('/').pop();
      if (unusedDefinitions.includes(reffedSchema)) {
        return false;
      }

      return true;
    });
  };

  return unreferencedDefinitionErrors.filter(
    (error) => !allOfsUsedSchema(error.path[1]),
  );
};
