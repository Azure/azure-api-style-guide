// Check that path parameter names are consistent across all paths.
// Specifically:
// - The path parameter that follows a static path segment must be the same across all paths

// `given` is the paths object
module.exports = (paths) => {
  if (paths === null || typeof paths !== 'object') {
    return [];
  }

  const errors = [];

  // Dict to accumulate the parameter name associated with a path segment
  const paramNameForSegment = {};

  // Identify inconsistent names by iterating over all paths and building up a
  // dictionary that maps a static path segment to the path parameter that
  // immediately follows that segment. We issue the message when we find
  // a static path segment that precedes a path parameter name that is
  // different from one previously stored in the dictionary.

  // eslint-disable-next-line no-restricted-syntax
  for (const pathKey of Object.keys(paths)) {
    const parts = pathKey.split('/').slice(1);

    parts.slice(1).forEach((v, i) => {
      if (v.includes('}')) {
        const param = v.match(/[^{}]+(?=})/)[0];
        // Get the preceding path segment
        const p = parts[i];
        if (paramNameForSegment[p]) {
          if (paramNameForSegment[p] !== param) {
            errors.push({
              message: `Inconsistent parameter names "${paramNameForSegment[p]}" and "${param}" for path segment "${p}".`,
              path: ['paths', pathKey],
            });
          }
        } else {
          paramNameForSegment[p] = param;
        }
      }
    });
  }

  return errors;
};
