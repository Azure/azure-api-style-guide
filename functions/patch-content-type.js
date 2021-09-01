const MERGE_PATCH = 'application/merge-patch+json';

// Verify that all patch operations and only patch operations consume merge-patch.
function checkOperationConsumes(targetVal) {
  const { paths } = targetVal;
  const errors = [];
  if (paths && typeof paths === 'object') {
    Object.keys(paths).forEach((path) => {
      ['post', 'put'].forEach((method) => {
        if (paths[path][method]) {
          const { consumes } = paths[path][method];
          if (consumes?.includes(MERGE_PATCH)) {
            errors.push({
              message: `A ${method} operation should not consume 'application/merge-patch+json' content type.`,
              path: ['paths', path, method, 'consumes'],
            });
          }
        }
      });
      if (paths[path].patch) {
        const { consumes } = paths[path].patch;
        if (!consumes || !consumes.includes(MERGE_PATCH)) {
          errors.push({
            message: "A patch operation should consume 'application/merge-patch+json' content type.",
            path: ['paths', path, 'patch', ...(consumes ? ['consumes'] : [])],
          });
        } else if (consumes.length > 1) {
          errors.push({
            message: "A patch operation should only consume 'application/merge-patch+json' content type.",
            path: ['paths', path, 'patch', 'consumes'],
          });
        }
      }
    });
  }

  return errors;
}

// Check API definition to ensure that all patch operations and only patch operations
// are defined with content-type = application/merge-patch+json
// @param targetVal - the entire API document
module.exports = (targetVal) => {
  if (targetVal === null || typeof targetVal !== 'object') {
    return [];
  }

  const errors = [];

  if (targetVal.consumes?.includes(MERGE_PATCH)) {
    errors.push({
      message: 'Global consumes should not specify `application/merge-patch+json` content type.',
      path: ['consumes'],
    });
  }

  errors.push(...checkOperationConsumes(targetVal));

  return errors;
};
