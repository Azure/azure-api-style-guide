// Check:
// - DO NOT include a version segment in the base_url or path

// Return the first segment of a path that matches the pattern 'v\d+' or 'v\d+.\d+
function getVersion(path) {
  const url = new URL(path, 'https://foo.bar');
  const segments = url.pathname.split('/');
  return segments.find((segment) => segment.match(/v[0-9]+(.[0-9]+)?/));
}

function checkPaths(targetVal) {
  const oas2 = targetVal.swagger;

  if (oas2) {
    const basePath = targetVal.basePath || '';
    const version = getVersion(basePath);
    if (version) {
      return [
        {
          message: `Version segment "${version}" in basePath violates Azure versioning policy.`,
          path: basePath,
        },
      ];
    }
  }

  // We did not find a major version in basePath, so now check the paths

  const { paths } = targetVal;
  const errors = [];
  if (paths && typeof paths === 'object') {
    Object.keys(paths).forEach((path) => {
      const version = getVersion(path);
      if (version) {
        errors.push({
          message: `Version segment "${version}" in path violates Azure versioning policy.`,
          path: ['paths', path],
        });
      }
    });
  }
  return errors;
}

function findVersionParam(params) {
  const isApiVersion = (elem) => elem.name === 'api-version' && elem.in === 'query';
  if (params && Array.isArray(params)) {
    return params.filter(isApiVersion).shift();
  }
  return undefined;
}

// Verify version parameter has certain characteristics:
// - it is required
// - if it has a default value, it has the form YYYY-MM-DD
function validateVersionParam(param, path) {
  const errors = [];
  if (!param.required) {
    errors.push({
      message: '"api-version" should be a required parameter',
      path,
    });
  }
  if (param.default && !param.default.match(/^\d\d\d\d-\d\d-\d\d(-preview)?$/)) {
    errors.push({
      message: 'Default value for "api-version" should be a date in YYYY-MM-DD format, optionally suffixed with \'-preview\'.',
      path: [...path, 'default'],
    });
  }
  return errors;
}

// Verify that every operation defines a query param called `api-version`
function checkVersionParam(targetVal) {
  const { paths } = targetVal;
  const errors = [];
  if (paths && typeof paths === 'object') {
    Object.keys(paths).forEach((path) => {
      // Parameters can be defined at the path level.
      if (paths[path].parameters && Array.isArray(paths[path].parameters)) {
        const versionParam = findVersionParam(paths[path].parameters);
        if (versionParam) {
          const index = paths[path].parameters.indexOf(versionParam);
          errors.push(...validateVersionParam(versionParam, ['paths', path, 'parameters', index.toString()]));
          return;
        }
      }

      ['get', 'post', 'put', 'patch', 'delete'].forEach((method) => {
        if (paths[path][method]) {
          const versionParam = findVersionParam(paths[path][method].parameters);
          if (versionParam) {
            const index = paths[path][method].parameters.indexOf(versionParam);
            errors.push(...validateVersionParam(versionParam, ['paths', path, method, 'parameters', index]));
          } else {
            errors.push({
              message: 'Operation does not define an "api-version" query parameter.',
              path: ['paths', path, method, 'parameters'],
            });
          }
        }
      });
    });
  }

  return errors;
}

// Check API definition to ensure conformance to Azure versioning guidelines.
// @param targetVal - the entire API document
module.exports = (targetVal) => {
  if (targetVal === null || typeof targetVal !== 'object') {
    return [];
  }

  const errors = checkPaths(targetVal);
  errors.push(...checkVersionParam(targetVal));

  return errors;
};
