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
  * [Error response](#error-response)
  * [Response headers](#response-headers)
- [Parameters](#parameters)
  * [Parameter names](#parameter-names)
  * [Descriptions](#descriptions)
  * [Format](#format)
  * [Default](#default)
- [Schemas](#schemas)
  * [Schema names](#schema-names)
  * [Descriptions](#descriptions-1)
  * [Format](#format-1)

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
- If the operation has a `skip` parameter, it must be an integer and optional
- If the operation has a `top` parameter, it must be an integer, optional, and have a documented default and maximum value
- If the operation has a `maxpagesize` parameter, it must be an integer, optional, and have a documented default and maximum value

### Long-running operations

All long-running operations should specify the autorest extension `x-ms-long-running-operation: true`.
This informs the client library generators to include support for checking operation completion.

### Error response

All operations should have a "default" (error) response with a response body that conforms to the Azure API Guidelines.

All `4xx` and `5xx` responses should specify `x-ms-error-response: true` except for `404` response of HEAD operation.

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

### Format

Format must be one of the values [defined by OpenAPI][openapi-data-types] or recognized by the Azure tooling.

<!-- Links -->

[openapi-data-types]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#data-types
[RFC7231]: https://tools.ietf.org/html/rfc7231
[wikipedia-camel-case]: https://en.wikipedia.org/wiki/Camel_case
[wikipedia-kebab-case]: https://en.wikipedia.org/wiki/Letter_case#Kebab_case
