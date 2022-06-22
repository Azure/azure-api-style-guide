const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-security-definitions');
  return linter;
});

test('az-security-definitions should find errors when securityDefinitions is missing', () => {
  const oasDoc = {
    swagger: '2.0',
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.length).toBe(0);
    expect(results[0].message).toContain('At least one security scheme must be defined');
  });
});

test('az-security-definitions should find errors when securityDefinitions has no entries', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {},
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('securityDefinitions');
    expect(results[0].message).toContain('At least one security scheme must be defined');
  });
});

// Test for security scheme with type: oauth2
test('az-security-definitions should find errors when securityDefinitions has oauth2 scheme with no scopes', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      oauth2: {
        type: 'oauth2',
        flow: 'implicit',
        authorizationUrl: 'https://example.com/oauth2/authorize',
        tokenUrl: 'https://example.com/oauth2/token',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('securityDefinitions.oauth2');
    expect(results[0].message).toContain('Security scheme with type: oauth2 should have non-empty "scopes" array.');
  });
});

// Test for security scheme with type: oauth2 with empty scopes
test('az-security-definitions should find errors when securityDefinitions has oauth2 scheme with empty scopes', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      oauth2: {
        type: 'oauth2',
        flow: 'implicit',
        authorizationUrl: 'https://example.com/oauth2/authorize',
        tokenUrl: 'https://example.com/oauth2/token',
        scopes: {},
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('securityDefinitions.oauth2.scopes');
    expect(results[0].message).toContain('Security scheme with type: oauth2 should have non-empty "scopes" array.');
  });
});

// Test for security scheme with type: oauth2 with scopes that do not match the pattern
test('az-security-definitions should find errors when oauth2 scheme scopes do not match the pattern', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      oauth2: {
        type: 'oauth2',
        flow: 'implicit',
        authorizationUrl: 'https://example.com/oauth2/authorize',
        tokenUrl: 'https://example.com/oauth2/token',
        scopes: {
          read: 'Read access to protected resources',
          write: 'Write access to protected resources',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('securityDefinitions.oauth2.scopes.read');
    expect(results[0].message).toContain('Oauth2 scope names should have the form: https://<audience>/<permission>');
    expect(results[1].path.join('.')).toBe('securityDefinitions.oauth2.scopes.write');
  });
});

// Test for security scheme with type: apiKey but not in: header
test('az-security-definitions should find errors when apiKey scheme is not in header', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        in: 'query',
        name: 'api_key',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('securityDefinitions.apiKey.in');
    expect(results[0].message).toContain('Security scheme with type "apiKey" should specify "in: header".');
  });
});

// Test for security scheme with unsupported type
test('az-security-definitions should find errors when securityDefinitions has unsupported type', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      unsupported: {
        type: 'basic',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('securityDefinitions.unsupported.type');
    expect(results[0].message).toContain('Security scheme must be type: oauth2 or type: apiKey.');
  });
});

// Test multiple errors are caught even after earlier valid schemes
test('az-security-definitions should find multiple errors after valid schemes', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      ApiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'api_key',
        description: 'API Key',
      },
      OauthBad: {
        description: 'Oauth2 scheme with some invalid scopes',
        type: 'oauth2',
        flow: 'application',
        tokenUrl:
          'https://login.microsoftonline.com/common/oauth2/authorize',
        scopes: {
          'https://atlas.microsoft.com/.default': 'default permissions to user account',
          'user impersonation': 'default permissions to user account',
        },
      },
      ApiKeyBad: {
        type: 'apiKey',
        in: 'query',
        name: 'api_key',
        description: 'API Key',
      },
      BasicBad: {
        type: 'basic',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('securityDefinitions.OauthBad.scopes.user impersonation');
    expect(results[1].path.join('.')).toBe('securityDefinitions.ApiKeyBad.in');
    expect(results[2].path.join('.')).toBe('securityDefinitions.BasicBad.type');
    expect(results[2].message).toContain('Security scheme must be type: oauth2 or type: apiKey.');
  });
});

test('az-security-definitions should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      AzureAuth: {
        description: 'Azure Active Directory OAuth2 Flow',
        type: 'oauth2',
        flow: 'application',
        tokenUrl:
          'https://login.microsoftonline.com/common/oauth2/authorize',
        scopes: {
          'https://atlas.microsoft.com/.default': 'default permissions to user account',
        },
      },
      ApiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'api_key',
        description: 'API Key',
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
