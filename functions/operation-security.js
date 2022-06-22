// Check API definition to ensure conformance to Azure security schemes guidelines.

// Check:
// - Operation (input) has a `security`, or there is a global `security`.

// @param input - an operation
module.exports = (input, _, context) => {
  if (input === null || typeof input !== 'object') {
    return [];
  }

  // If there is a global `security`, no need to check the operation.
  if (context.document.data.security) {
    return [];
  }

  const path = context.path || [];

  if (!input.security) {
    return [{
      message: 'Operation should have a security requirement.',
      path: [...path, 'security'],
    }];
  }

  return [];
};
