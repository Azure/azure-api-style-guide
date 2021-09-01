# Azure Ruleset

The Azure ruleset incorporates a select set of the Spectral oas rules and a collection of custom rules
to verify compliance to
the [Azure API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md) and
the [Azure OpenAPI Style Guidelines](./openapi-style-guidelines.md).

## Azure Custom Rules

### az-consistent-response-body

For a path with a "create" operation (put or patch that returns 201), the 200 response of
get, put, and patch, if present, should have the same response body schema
as the create operation 201 response.

### az-default-response

All operations should have a default (error) response.

### az-delete-204-response

A delete operation should have a 204 response.

### az-error-response

Error response body should conform to Azure API Guidelines.

Every operation should have a default response with error response body.

All `4xx` and `5xx` responses should specify `x-ms-error-response: true` except for `404` response of HEAD operation.

### az-lro-headers

A 202 response should include an Operation-Location response header.

### az-operation-id

The `operationId` should be of the form `Noun_Verb`.  It should contain exactly one underscore.

The `Verb` of the `operationId` should be or contain a specific value depending on the operation method:

| operation method | verb should contain | notes  |
| ---------------- | ------------------- | ------ |
| get              | "Get" or "List"     | should be "List" if response is pageable |
| put              | "Create"            | could be "CreateOrUpdate" |
| patch            | "Update"            | could be "CreateOrUpdate" |
| delete           | "Delete"            | |

### az-operation-summary-or-description

Operation should have a summary or description.

### az-pagination-response

If the operation returns a list that is potentially large, it should [support pagination](../opeapi-style-guidelines.md#).

### az-parameter-description

All parameters should have a description.

### az-parameter-names-convention

Query parameter names should be lowerCamelCase; header parameter names should be kebab case.

### az-patch-content-type

The request body content type for patch operations should be JSON merge patch.

Only patch operations should accept JSON merge patch.

### az-path-characters

Service-defined path segments should be restricted to 0-9 A-Z a-z - . _ ~, with : allowed only as described below to designate an action operation.

### az-post-201-response

Using post for a create operation is discouraged.  Use put or patch instead.

### az-property-description

All schema properties should have a description.

### az-property-names-convention

Property names should be lowerCamelCase.

### az-request-body-not-allowed

A get or delete operation must not accept a request body/body parameter.

A requestBody/body parameter should only be specified for HTTP methods where
the HTTP 1.1 specification [RFC7231][RFC7231] has explicitly defined semantics for request bodies.
RFC7231 states that the payload for both get and delete "has no defined semantics".

### az-schema-description-or-title

All schemas should have a description or title.

### az-schema-names-convention

Schema names should be Pascal case.

### az-success-response-body

All success responses except 202 and 204 should define a response body.

### az-success-response-nobody

Responses for status codes 202 and 204 should have no response body.

### az-unique-param-names

All parameter names for an operation -- including parameters defined at the path level -- should be case-insensitive unique.

### az-version-convention

API version (`info.version`) should be a date in YYYY-MM-DD format, optionally suffixed with '-preview'.

### az-version-policy

API version should not be specified in path segment, and all operations should accept `api-version` query param with date value in YYYY-MM-DD format, optionally suffixed with '-preview'.

[RFC7231]: https://tools.ietf.org/html/rfc7231
