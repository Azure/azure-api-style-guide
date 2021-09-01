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
  * [Version parameter](#version-parameter)
- [Operations](#operations)
  * [Path](#path)
  * [Summary and description](#summary-and-description)
  * [OperationId](#operationid)
  * [Request body](#request-body)
  * [Response body](#response-body)
  * [Error response](#error-response)
  * [Response headers](#response-headers)
- [Parameters](#parameters)
  * [Parameter names](#parameter-names)
  * [Descriptions](#descriptions)
  * [Format](#format)
- [Schemas](#schemas)
  * [Schema names](#schema-names)
  * [Property names](#property-names)
  * [Descriptions](#descriptions-1)
  * [Format](#format-1)

<!-- tocstop -->
<!-- markdownlint-enable MD004 -->

<!-- --------------------------------------------------------------- -->

## Introduction

The following are guidelines for writing API descriptions for Azure using OpenAPI.
Of course, all OpenAPI documents should conform to the [OpenAPI specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md).

In addition, Azure services should adhere to the [Microsoft Azure HTTP/REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/azureRestUpdates/azure/Guidelines.md).

The guidelines in this document extend and/or clarify the OpenAPI specification and Azure API Guidelines
to address aspects of API description related to the generation of client libraries
suitable for distribution in a Software Development Kit (SDK).

## Versioning

### Version of API definition

The API version (`info.version`) should be a date in YYYY-MM-DD format, optionally suffixed with '-preview'.

### Version parameter

API version should not be specified in path segment, and all operations should accept `api-version` query param with date value in YYYY-MM-DD format, optionally suffixed with '-preview'.

<!-- --------------------------------------------------------------- -->

## Operations

### Path

Service-defined path segments should be restricted to `0-9 A-Z a-z - . _ ~`,
with `:` allowed only to designate an action operation.

### Method

Use put or patch for create operations, rather than post, since post is not inherently idempotent.

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
| put              | "Create"            | could be "CreateOrUpdate" |
| patch            | "Update"            | could be "CreateOrUpdate" |
| delete           | "Delete"            | |

Further, a put or patch that supports both create and update should have "Create" and "Update" in the verb.

### Request body

A get or delete operation must not accept a request body/body parameter.

A requestBody/body parameter should only be specified for HTTP methods where
the HTTP 1.1 specification [RFC7231][RFC7231] has explicitly defined semantics for request bodies.
RFC7231 states that the payload for both get and delete "has no defined semantics".

The request body for a patch operation should be `application/merge-patch+json` content type.

### Response body

All success responses except 202 and 204 should define a response body.

Responses for status codes 202 and 204 should have no response body.

A delete operation should have a 204 response.

For a path with a "create" operation (put or patch that returns 201),
the 200 response of get, put, and patch, if present, should have the same response body schema
as the create operation 201 response.

### Support for pagination

If the operation returns a list that is potentially large, it should support pagination.

To support pagination:
- The operation should have the `x-ms-pageable` annotation
- The operation response should contain a top-level `value` property of type array and required
- The operation response should contain a top-level `nextLink` property of type string and optional
- If the operation has a `skip` parameter, it must be an integer and optional
- If the operation has a `top` parameter, it must be an integer, optional, and have a documented default and maximum value
- If the operation has a `maxpagesize` parameter, it must be an integer, optional, and have a documented default and maximum value

### Error response

All operations should have a "default" (error) response.

Error response body should conform to Azure API Guidelines.

All `4xx` and `5xx` responses should specify `x-ms-error-response: true` except for `404` response of HEAD operation.

### Response headers

A 202 response should include an `Operation-Location` response header.

Error response should contain a `x-ms-error-code` response header.

<!-- --------------------------------------------------------------- -->

## Parameters

### Parameter names

Path and query parameter names should be [camel case][wikipedia-camel-case]; header parameter names should be [kebab case][wikipedia-kebab-case].

All parameter names for an operation -- including parameters defined at the path level -- should be case-insensitive unique.

### Descriptions

Every parameter should have a description.

### Format

Format must be one of the values [defined by OpenAPI][openapi-data-types] and recognized by the Azure tooling.

Integer properties must specify a format of either `int32` or `int64`.

### Default

Required parameters should not specify a default value.

<!-- --------------------------------------------------------------- -->

## Schemas

OpenAPI uses JSON Schema as the means for describing request and response body payloads.

### Schema names

Schema names should be [Pascal case][wikipedia-camel-case].

### Property names

Property names should be [camel case][wikipedia-camel-case].

### Descriptions

Every schema should have a description or a title.

Every schema property should have a description.

### Format

Integer properties must specify a format of either int32 and int64.

Format must be one of the values defined by OpenAPI and recognized by the Azure tooling.

<!-- Links -->

[openapi-data-types]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#data-types
[RFC7231]: https://tools.ietf.org/html/rfc7231
[wikipedia-camel-case]: https://en.wikipedia.org/wiki/Camel_case
[wikipedia-kebab-case]: https://en.wikipedia.org/wiki/Letter_case#Kebab_case
