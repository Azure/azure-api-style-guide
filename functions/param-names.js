// Check conformance to Azure parameter naming conventions:
// - path and query parameters must be camel case
// - header parameters must be kebab-case

module.exports = (targetVal, _opts, paths) => {
  if (targetVal === null || typeof targetVal !== 'object') {
    return [];
  }

  const path = paths.target || paths.given;

  // These errors will be caught elsewhere, so silently ignore here
  if (!targetVal.in || !targetVal.name) {
    return [];
  }

  if (['path', 'query'].includes(targetVal.in) && targetVal.name !== 'api-version') {
    if (!targetVal.name.match(/^[a-z][a-z0-9]*([A-Z][a-z0-9]+)*$/)) {
      return [
        {
          message: `Parameter name "${targetVal.name}" should be camel case.`,
          path: [...path, 'name'],
        },
      ];
    }
  } else if (targetVal.in === 'header') {
    if (!targetVal.name.match(/^[A-Za-z][a-z0-9]*(-[A-Za-z][a-z0-9]*)*$/)) {
      return [
        {
          message: `header parameter name "${targetVal.name}" should be kebab case.`,
          path: [...path, 'name'],
        },
      ];
    }
  }

  return [];
};
