// Check:
// - each entry of a global or operation `security` property references a defined
//   security scheme.
// - all scopes referenced by an "oauth2" entry are defined in the corresponding
//   security scheme.

// @param input - a security property (global or operation)
module.exports = (input, _, context) => {
  if (input === null || !Array.isArray(input)) {
    return [];
  }

  const isObject = (obj) => obj && typeof obj === 'object';
  const oas2Schemes = (doc) => (isObject(doc.securityDefinitions) ? doc.securityDefinitions : {});
  const oas3Schemes = (doc) => (isObject(doc.components) && isObject(doc.components.securitySchemes)
    ? doc.components.securitySchemes : {});

  const oasDoc = context.document.data;
  const schemes = oasDoc.swagger ? oas2Schemes(oasDoc) : oas3Schemes(oasDoc);

  const path = context.path || [];

  const errors = [];
  input.forEach((securityReq, index) => {
    // oas2-schema requires securityReq to be an object.
    // Checking here just to avoid runtime errors.
    if (isObject(securityReq)) {
      // security with no elements will be flagged by az-security-min-length
      Object.keys(securityReq).forEach((key) => {
        if (!schemes[key]) {
          errors.push({
            message: `Security scheme "${key}" is not defined.`,
            path: [...path, index, key],
          });
          return;
        }

        const scheme = schemes[key];
        // oas2-schema requires scheme to be an object.
        // Checking here just to avoid runtime errors.
        if (!isObject(scheme)) { return; }

        const scopes = securityReq[key];
        // oas2-schema requires scopes to be an array.
        // Checking here just to avoid runtime errors.
        if (!Array.isArray(scopes)) { return; }

        if (scheme.type === 'oauth2') {
          if (scopes.length === 0) {
            errors.push({
              message: 'OAuth2 security scheme requires at least one scope.',
              path: [...path, index, key],
            });
          }
          scopes.forEach((scope, scopeIndex) => {
            if (!scheme.scopes[scope]) {
              errors.push({
                message: `Scope "${scope}" is not defined for security scheme "${key}".`,
                path: [...path, index, key, scopeIndex],
              });
            }
          });
        } else if (scopes.length > 0) {
          errors.push({
            message: `Security scheme "${key}" does not support scopes.`,
            path: [...path, index, key],
          });
        }
      });
    }
  });

  return errors;
};
