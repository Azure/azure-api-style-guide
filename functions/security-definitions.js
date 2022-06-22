// Check API definition to ensure conformance to Azure security schemes guidelines.

// Check:
// - There is at least one security scheme.
// - All security schemes are either:
//   - type: oauth2 or
//   - type: apiKey with in: header
// - An oauth2 security scheme defines at least one scope.
// - All scopes defined in an oauth2 security scheme match a pattern:
//   - https:\/\/[\w-]+(\.[\w-]+)+/[\w-.]+

// @param doc - the entire API document
module.exports = (doc) => {
  if (doc === null || typeof doc !== 'object') {
    return [];
  }

  if (!doc.securityDefinitions || (typeof doc.securityDefinitions === 'object' && Object.keys(doc.securityDefinitions).length === 0)) {
    return [{
      message: 'At least one security scheme must be defined.',
      path: ['securityDefinitions'],
    }];
  }

  const schemes = doc.securityDefinitions;

  const errors = [];

  Object.keys(schemes).forEach((schemeKey) => {
    const scheme = schemes[schemeKey];
    // Silently ignore scheme if not an object -- oas2-schema will flag this as an error.
    // The check here is just to avoid runtime exceptions.
    if (typeof scheme === 'object') {
      const path = ['securityDefinitions', schemeKey];
      if (scheme.type === 'oauth2') {
        if (!scheme.scopes || (typeof scheme.scopes === 'object' && Object.keys(scheme.scopes).length === 0)) {
          errors.push({
            message: 'Security scheme with type: oauth2 should have non-empty "scopes" array.',
            path: [...path, 'scopes'],
          });
        } else {
          // All scopes must match the pattern
          Object.keys(scheme.scopes).forEach((scope) => {
            if (!scope.match(/^https:\/\/[\w-]+(\.[\w-]+)+\/[\w-.]+$/)) {
              errors.push({
                message: 'Oauth2 scope names should have the form: https://<audience>/<permission>',
                path: [...path, 'scopes', scope],
              });
            }
          });
        }
      } else if (scheme.type === 'apiKey') {
        if (scheme.in !== 'header') {
          errors.push({
            message: 'Security scheme with type "apiKey" should specify "in: header".',
            path: [...path, 'in'],
          });
        }
      } else {
        errors.push({
          message: 'Security scheme must be type: oauth2 or type: apiKey.',
          path: [...path, 'type'],
        });
      }
    }
  });

  return errors;
};
