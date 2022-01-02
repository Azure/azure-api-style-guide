// Check conformance to Azure parameter order conventions:
// - path parameters must be in the same order as the path

// NOTE: Missing path parameters will be flagged by the Spectral path-params rule

// `given` is the paths object
module.exports = (paths) => {
  if (paths === null || typeof paths !== 'object') {
    return [];
  }

  const inPath = (p) => p.in === 'path';
  const paramName = (p) => p.name;
  const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

  const errors = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const pathKey of Object.keys(paths)) {
    // find all the path parameters in pathKey
    const paramsInPath = pathKey.match(/[^{}]+(?=})/g) ?? [];
    if (paramsInPath.length > 0) {
      const pathItem = paths[pathKey];
      const pathItemPathParams = pathItem.parameters?.filter(inPath).map(paramName) ?? [];

      // find the first index where in-consistency observed or offset till no in-consistency
      // observed to validate further
      const indx = pathItemPathParams.findIndex((v, i) => v !== paramsInPath[i]);
      // If path params exists and are not in expected order then raise the error
      if (indx >= 0 && indx < paramsInPath.length) {
        // NOTE: we do not include `indx` in the path because if the parameter is a ref then
        // Spectral will show the path of the ref'ed parameter and not the path/operation with
        // improper ordering
        errors.push({
          message: `Path parameter "${paramsInPath[indx]}" should appear before "${pathItemPathParams[indx]}".`,
          path: ['paths', pathKey, 'parameters'], // no index in path
        });
      } else { // this will be a case when few path params are defined in respective methods
        const offset = pathItemPathParams.length;
        methods.filter((m) => pathItem[m]).forEach((method) => {
          const opPathParams = pathItem[method].parameters?.filter(inPath).map(paramName) ?? [];

          const indx2 = opPathParams.findIndex((v, i) => v !== paramsInPath[offset + i]);
          if (indx2 >= 0 && (offset + indx2) < paramsInPath.length) {
            errors.push({
              message: `Path parameter "${paramsInPath[offset + indx2]}" should appear before "${opPathParams[indx2]}".`,
              path: ['paths', pathKey, method, 'parameters'], // no index in path
            });
          }
        });
      }
    }
  }

  return errors;
};
