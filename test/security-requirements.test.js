const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-security-requirements');
  return linter;
});

test('az-security-requirements should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      apim_key: {
        type: 'apiKey',
        name: 'Ocp-Apim-Subscription-Key',
        in: 'header',
      },
    },
    security: [
      {
        AADToken: ['read', 'write'],
      },
    ],
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('security.0.AADToken');
  });
});

test('az-security-requirements should find oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0.0',
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        AADToken: ['read', 'write'],
      },
    ],
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('security.0.AADToken');
  });
});

test('az-security-requirements should find undefined scope', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      oauth2: {
        type: 'oauth2',
        flow: 'application',
        tokenUrl: 'https://example.com/oauth2/token',
        scopes: {
          'https://example.com/read': 'Read access to protected resources',
          'https://example.com/write': 'Write access to protected resources',
        },
      },
    },
    security: [
      {
        oauth2: ['read'],
      },
    ],
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('security.0.oauth2.0');
  });
});

test('az-security-requirements should find empty oauth2 scopes in operation', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      oauth2: {
        type: 'oauth2',
        flow: 'application',
        tokenUrl: 'https://example.com/oauth2/token',
        scopes: {
          'https://example.com/read': 'Read access to protected resources',
          'https://example.com/write': 'Write access to protected resources',
        },
      },
    },
    paths: {
      '/test1': {
        get: {
          operationId: 'read',
          security: [
            {
              oauth2: [],
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./test1.get.security.0.oauth2');
  });
});

test('az-security-requirements should find undefined oauth2 scope in operation', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      oauth2: {
        type: 'oauth2',
        flow: 'application',
        tokenUrl: 'https://example.com/oauth2/token',
        scopes: {
          'https://example.com/read': 'Read access to protected resources',
          'https://example.com/write': 'Write access to protected resources',
        },
      },
    },
    paths: {
      '/test1': {
        get: {
          operationId: 'read',
          security: [
            {
              oauth2: ['read'],
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./test1.get.security.0.oauth2.0');
  });
});

test('az-security-requirements should find non-empty apikey scopes in operation', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      apim_key: {
        type: 'apiKey',
        name: 'Ocp-Apim-Subscription-Key',
        in: 'header',
      },
    },
    paths: {
      '/test1': {
        get: {
          operationId: 'read',
          security: [
            {
              apim_key: ['read'],
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./test1.get.security.0.apim_key');
  });
});

test('az-security-requirements should find multiple errors', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      apim_key: {
        type: 'apiKey',
        name: 'Ocp-Apim-Subscription-Key',
        in: 'header',
      },
      AADToken: {
        type: 'oauth2',
        flow: 'application',
        tokenUrl: 'https://example.com/oauth2/token',
        scopes: {
          'https://example.com/read': 'Read access to protected resources',
          'https://example.com/write': 'Write access to protected resources',
        },
      },
    },
    security: [
      {
        apim_key: [],
        AADToken: ['https://example.com/read'],
      },
      {
        apim_key: ['read', 'write'],
        AADToken: ['https://example.com/read', 'write'],
      },
      {
        api_key: [],
      },
    ],
    paths: {
      '/test1': {
        get: {
          operationId: 'read',
          security: [
            {
              apim_key: [],
            },
            {
              api_key: [],
              AADToken: ['read'],
            },
          ],
        },
        post: {
          operationId: 'write',
          security: [
            {
              apim_key: ['write'],
            },
            {
              AADToken: ['https://example.com/read', 'write'],
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(7);
    expect(results[0].path.join('.')).toBe('security.1.apim_key');
    expect(results[1].path.join('.')).toBe('security.1.AADToken.1');
    expect(results[2].path.join('.')).toBe('security.2.api_key');
    expect(results[3].path.join('.')).toBe('paths./test1.get.security.1.api_key');
    expect(results[4].path.join('.')).toBe('paths./test1.get.security.1.AADToken.0');
    expect(results[5].path.join('.')).toBe('paths./test1.post.security.0.apim_key');
    expect(results[6].path.join('.')).toBe('paths./test1.post.security.1.AADToken.1');
  });
});

test('az-security-requirements should not fail on malformed API doc', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      oauth2: "type: 'oauth2'",
    },
    security: [
      {
        oauth2: ['read'],
      },
    ],

  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-security-requirements should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    securityDefinitions: {
      apim_key: {
        type: 'apiKey',
        name: 'Ocp-Apim-Subscription-Key',
        in: 'header',
        description: 'API Key for your subscription',
      },
    },
    security: [
      {
        apim_key: [],
      },
    ],
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-security-requirements should find no oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0.0',
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JSON Web Token with credentials for the service',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
