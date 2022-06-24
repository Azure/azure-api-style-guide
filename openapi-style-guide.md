# OpenAPI Style Guidelines

## Table of Contents

<!--
  The TOC below is generated using the `markdown-toc` node package.

      https://github.com/jonschlinkert/markdown-toc

  You should regenerate the TOC after making changes to this file.

      ./node_modules/.bin/markdown-toc -i openapi-style-guidelines.md
  -->

<!-- markdownlint-disable MD004 -->

<!-- toc -->

- [Introduction](#introduction)
- [Versioning](#versioning)
  * [Version of API definition](#version-of-api-definition)
- [Operations](#operations)
  * [Summary and description](#summary-and-description)
  * [OperationId](#operationid)
  * [Request body](#request-body)
  * [Response body](#response-body)
  * [Support for pagination](#support-for-pagination)
  * [Long-running operations](#long-running-operations)
  * [Error response](#error-response)
  * [Response headers](#response-headers)
- [Parameters](#parameters)
  * [Parameter names](#parameter-names)
  * [Parameter order](#parameter-order)
  * [Descriptions](#descriptions)
  * [Format](#format)
  * [Default](#default)
  * [Path parameters](#path-parameters)
- [Schemas](#schemas)
  * [Schema names](#schema-names)
  * [Descriptions](#descriptions-1)
  * [Type and format](#type-and-format)
- [Security](#security)
  * [Security Definitions](#security-definitions)
    + [Examples](#examples)
  * [Security Requirements](#security-requirements)

<!-- tocstop -->

<!-- markdownlint-enable MD004 -->

<!-- --------------------------------------------------------------- -->

## Introduction

This document contains guidelines that complement and extend the
[OpenAPI 2.0 specification](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md) and
[Microsoft Azure REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md) for describing an Azure API with an OpenAPI 2.0 API definition.
The goal of these guidelines is to establish the requirements for complete and consistent API definitions
that will ensure high quality in generated documentation and client libraries.

## Versioning

### Version of API definition

The API version (`info.version`) should specify the current version of the API.
For services that use date-based versions, this should be a date in YYYY-MM-DD format, optionally suffixed with '-preview'.

<!-- --------------------------------------------------------------- -->

## Operations

### Summary and description

Each operation should have a summary and/or description.
When both a summary and description are provided, the description should include additional detail
about the operation behavior -- it should not simply restate the summary.

### OperationId

Every operation should have a unique `operationId`.

The `operationId` should be of the form `Noun_Verb`.  It should contain exactly one underscore.

AutoRest breaks the operation id into its `Noun` and `Verb` where `Noun` becomes name of the operations class and the Verb becomes the name of the method in that class, i.e., operations are grouped inside the operations class named after the noun.

The `Verb` of the `operationId` should be or contain a specific value depending on the operation method:

| operation method | verb should contain | notes  |
| ---------------- | ------------------- | ------ |
| get              | "Get" or "List"     | should be "List" if response is pageable |
| put              | "Create" or "Update" | could be "CreateOrUpdate" |
| patch            | "Update"            | could be "CreateOrUpdate" |
| delete           | "Delete"            | |

Further, a put or patch that supports both create and update should have "Create" and "Update" in the verb.

### Request body

The request body for a patch operation should be `application/merge-patch+json` content type.

### Response body

All success responses except 202 and 204 should define a response body.

Responses for status codes 202 and 204 should have no response body.

A delete operation should have a 204 response.

For a path with a "create" operation (put or patch that returns 201),
the 200 response of get, put, and patch, if present, should have the same response body schema
as the create operation 201 response.

### Support for pagination

To support pagination:
- The operation should have the `x-ms-pageable` annotation
- The operation response should contain a top-level `value` property of type array and required
- The operation response should contain a top-level `nextLink` property of type string and optional
- If present, the `top` parameter must be an integer, optional, with no default value
- If present, the `skip` parameter must be an integer, optional, with a default value of 0
- If present, the `maxpagesize` parameter must be an integer, optional, with no default value
- If present, the `filter` parameter must be a string and optional
- If present, the `orderby` parameter should be be an array of strings and optional
- If present, the `select` parameter should be be an array of strings and optional
- If present, the `expand` parameter should be be an array of strings and optional

### Long-running operations

All long-running operations should specify the autorest extension `x-ms-long-running-operation: true`.
This informs the client library generators to include support for checking operation completion.

### Error response

All operations should have a "default" (error) response with a response body that conforms to the Azure API Guidelines.

All `4xx` and `5xx` responses should specify `x-ms-error-response: true` except for `404` response of HEAD operation.
You do not need to specify `x-ms-error-response: true` on the "default" response.

Every error response should include the `x-ms-error-code` response header in the `headers` of the response.

Example:
```json
      "400": {
        "description": "Bad Request",
        "headers": {
          "x-ms-error-code": {
            "type": "string",
            "description": "The error code."
          }
        },
        "schema": {
          "$ref": "#/definitions/ErrorResponse"
        },
        "x-ms-error-response": true
      },
```

### Response headers

A 202 response should include the `Operation-Location` response header in the `headers` of the response.

Example:
```json
    "responses": {
      "202": {
        "description": "The service has accepted the request and will start processing later.",
        "headers": {
          "Operation-Location": {
            "description": "URL to query for status of the operation.",
            "type": "string"
          }
        }
      },
```

<!-- --------------------------------------------------------------- -->

## Parameters

### Parameter names

All parameter names for an operation -- including parameters defined at the path level -- should be case-insensitive unique.

Path parameter names should be consistent across all paths.

### Parameter order

Path parameters should be in the same order as they appear in the path.

### Descriptions

Every parameter should have a description.

### Format

Format must be one of the values [defined by OpenAPI][openapi-data-types] or recognized by the Azure tooling.

### Default

Required parameters should not specify a default value.

### Path parameters

Path parameters should be defined as `type: string` with a `maxLength` and a `pattern` that restricts
the characters that can be be used in the parameter value.

<!-- --------------------------------------------------------------- -->

## Schemas

OpenAPI uses JSON Schema as the means for describing request and response body payloads.

### Schema names

Schema names should be [Pascal case][wikipedia-camel-case].

### Descriptions

Every schema should have a description or a title.

Every schema property should have a description.

### Type and format

Every schema should specify an explicit type (some exceptions allowed for "any" type).

Format must be one of the values [defined by OpenAPI][openapi-data-types] or recognized by the Azure tooling.

<!-- --------------------------------------------------------------- -->

## Security

### Security Definitions

Every API definition must have a `securityDefinitions` section with at least one valid security scheme.

Each security scheme must have a `type` of "oauth2" or "apiKey" with `in` "header".

Each security scheme must have a `description` with a plain English explanation of the security scheme.

For "oauth2" security schemes, `scopes` must contain at least one entry.

The key of each entry in `scopes` must be of the form "<resource URI>/scope name", where "scope name" is typically ".default" for Azure services.

#### Examples

The following example shows how to define a security scheme for Azure Active Directory authentication:
```
  "securityDefinitions": {
    "MySecurityScheme": {
      "type": "oauth2",
      "tokenUrl": "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      "flow": "application",
      "description": "Azure Active Directory OAuth2 authentication",
      "scopes": {
        "https://resource.microsoft.com/.default": "Client credential scope"
      }
    }
  }
```

Note that the name "MySecurityScheme" has no significance, and "https://resource.microsoft.com/" is meant to signify the URI of the public cloud resource.

The "flow" is not particularly relevant but the "implicit" oauth2 flow is now considered insecure so another choice like "application" is preferable.

The following example defines an apikey security scheme:
```
  "securityDefinitions": {
    "MyApiKeySecurityScheme": {
      "type": "apiKey",
      "name": "Ocp-Apim-Subscription-Key",
      "in": "header",
      "description": "A subscription key for a Language service resource."
    }
  },
```

### Security Requirements

Every operation must have a `security`, or there must be a global `security`, with at least one entry.

Every entry of a global or operation `security` must reference a security scheme in the `securityDefinitions`.

<!-- Links -->

[openapi-data-types]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#data-types
[RFC7231]: https://tools.ietf.org/html/rfc7231
[wikipedia-camel-case]: https://en.wikipedia.org/wiki/Camel_case
[wikipedia-kebab-case]: https://en.wikipedia.org/wiki/Letter_case#Kebab_case
