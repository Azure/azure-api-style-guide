// Check that the parameters of an operation -- including those specified on the path -- are
// are case-insensitive unique regardless of "in".

// Return the "canonical" casing for a string.
// Currently just lowercase but should be extended to convert kebab/camel/snake/Pascal.
function canonical(name) {
  return typeof (value) === 'string' ? name.toLowerCase() : name;
}

// Accept an array and return a list of unique duplicate entries in canonical form.
// This function is intended to work on strings but is resilient to non-strings.
function dupIgnoreCase(arr) {
  if (!Array.isArray(arr)) {
    return [];
  }

  const isDup = (value, index, self) => self.indexOf(value) !== index;

  return [...new Set(arr.map((v) => canonical(v)).filter(isDup))];
}

// targetVal should be a [path item object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#pathItemObject).
// The code assumes it is running on a resolved doc
module.exports = (pathItem, _opts, paths) => {
  if (pathItem === null || typeof pathItem !== 'object') {
    return [];
  }
  const path = paths.path || [];

  const errors = [];

  const pathParams = pathItem.parameters ? pathItem.parameters.map((p) => p.name) : [];

  // Check path params for dups
  const pathDups = dupIgnoreCase(pathParams);

  // Report all dups
  pathDups.forEach((dup) => {
    // get the index of all names that match dup
    const dupKeys = [...pathParams.keys()].filter((k) => canonical(pathParams[k]) === dup);
    // Refer back to the first one
    const first = `parameters.${dupKeys[0]}`;
    // Report errors for all the others
    dupKeys.slice(1).forEach((key) => {
      errors.push({
        message: `Duplicate parameter name (ignoring case) with ${first}.`,
        path: [...path, 'parameters', key, 'name'],
      });
    });
  });

  ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].forEach((method) => {
    // If this method exists and it has parameters, check them
    if (pathItem[method] && Array.isArray(pathItem[method].parameters)) {
      const allParams = [...pathParams, ...pathItem[method].parameters.map((p) => p.name)];

      // Check method params for dups -- including path params
      const dups = dupIgnoreCase(allParams);

      // Report all dups
      dups.forEach((dup) => {
        // get the index of all names that match dup
        const dupKeys = [...allParams.keys()].filter((k) => canonical(allParams[k]) === dup);
        // Refer back to the first one - could be path or method
        const first = dupKeys[0] < pathParams.length ? `parameters.${dupKeys[0]}`
          : `${method}.parameters.${dupKeys[0] - pathParams.length}`;
        // Report errors for any others that are method parameters
        dupKeys.slice(1).filter((k) => k >= pathParams.length).forEach((key) => {
          errors.push({
            message: `Duplicate parameter name (ignoring case) with ${first}.`,
            path: [...path, method, 'parameters', key - pathParams.length, 'name'],
          });
        });
      });
    }
  });

  return errors;
};
