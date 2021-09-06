// Check that the parameters of an operation -- including those specified on the path -- are
// are case-insensitive unique regardless of "in".

function uniqueIgnoreCase(targetVal) {
  if (targetVal === null || !Array.isArray(targetVal)) {
    return [];
  }

  const isString = (value) => typeof (value) === 'string';
  const notUnique = (value, index, self) => self.indexOf(value) !== index;

  return [...new Set(targetVal.filter(isString).map((v) => v.toLowerCase()).filter(notUnique))];
}

// targetVal should be a [path item object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#pathItemObject).
// The code assumes it is running on a resolved doc
module.exports = (targetVal, _opts, paths) => {
  if (targetVal === null || typeof targetVal !== 'object') {
    return [];
  }
  const path = paths.target || paths.given || [];

  const pathParams = targetVal.parameters ? targetVal.parameters.map((p) => p.name) : [];

  const errors = [];
  ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].forEach((method) => {
    if (targetVal[method]) {
      const op = targetVal[method];
      const opParams = op.parameters ? op.parameters.map((p) => p.name) : [];

      // Find dups
      const dups = uniqueIgnoreCase([...pathParams, ...opParams]);

      // Report all dups
      dups.forEach((dup) => {
        const dupVals = [...pathParams, ...opParams].filter(
          (v) => typeof (v) === 'string' && v.toLowerCase() === dup.toLowerCase(),
        );
        errors.push({
          message: `Parameter names are not case-insensitive unique: ${dupVals.join(', ')}`,
          path: [...path, method],
        });
      });
    }
  });

  return errors;
};
