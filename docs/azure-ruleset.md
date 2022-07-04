# Azure Ruleset

The Azure ruleset incorporates a select set of the Spectral oas rules and a collection of custom rules
to verify compliance to
the [Azure API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md) and
the [Azure OpenAPI Style Guidelines](../openapi-style-guide.md).

The Azure ruleset is a _tool_ that helps identify problematic API designs, but the results should not be taken as gospel.
It may warn you about things that you have conscientiously done.
Spectral provides an [override mechanism](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets#overrides)
that can be used to disable rules for specific files or file globs and specific JSON paths.

## Azure Custom Rules

### az-additional-properties-and-properties

Don't specify both `additionalProperties` and `properties` in the same object schema.
Only use `additionalProperties` to define "map" structures.

### az-additional-properties-object

Specifying `additionalProperties` with `type: object` is usually an error.
It specifies that the property value must be a JSON object, and not a string or number or array.
What is probably intended is to allow property values of any type, which is best specified by simply omitting the `type`, e.g.:
```json
    "additionalProperties": {}
```

### az-api-version-enum

The api-version parameter should not be an enum. This rule is primarily to discourage a practice observed in some APIs
of defining api-version as an enum with a single value -- the most current API version.
This requires removing the old API version when a new version is defined,
which is disallowed by the breaking changes policy.

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

### az-formdata

Check for appropriate use of formData parameters.

It can be appropriate to use formData parameters when sending multiple file-type parameters or an array of file-type parameters.
But it is usually unnecessary and can be overly complicated to use formData when all you are doing is sending a single file-type parameter.
Instead, consider defining a `body` parameter with `type: string, format: binary` and use content-type `application/octet-stream`.

### az-header-disallowed

The `Authorization`, `Content-type`, and `Accept` headers should not be defined explicitly since their definition is
implied by other elements of the API definition.

In OpenAPI 2, valid values for `Authorization` should be specified in the `SecurityDefintions` / `Security` objects,
values of `Content-type` are specified by `consumes`, and values of `Accept` are specified by `produces`.

In OpenAPI 3, valid values for `Authorization` should be specified in the `SecuritySchemes` / `Security` objects,
values of `Content-type` are specified by the keys of the `content` object in `requestBody`, and values of `Accept`
are specified by union of the keys of the `content` objects of all elements of the `responses` object.

The [OpenAPI 3 specification](https://github.com/OAI/OpenAPI-Specification/blob/3.0.3/versions/3.0.3.md#fixed-fields-10)
explicitly states that these header definitions should be ignored.

### az-lro-extension

Operations with a 202 response should specify `x-ms-long-running-operation: true`.

### az-lro-headers

A 202 response should include an Operation-Location response header.

### az-ms-client-flatten

The use of the autorest `x-ms-client-flatten` extension is discouraged.

### az-ms-paths

Don't use the Autorest `x-ms-paths` extension except where necessary to support legacy APIs.

`x-ms-paths` is needed to describe non-pure REST APIs that implement multiple operations on a single path and method,
typically distinguished by a query parameter value, which is not supported by OpenAPI.

### az-nullable

Avoid the use of the autorest extension `x-nullable`.

There is no need to specify `x-nullable: false`. This extension only has effect when its value is true.

Specifying `x-nullable: true` signifies that the value "null" has a different semantic meaning that the property not being present.
This is problematic for some high-level languages and should be avoided unless there is strong justification for doing so.

### az-operation-id

The `operationId` should be of the form `Noun_Verb`.  It should contain exactly one underscore.

The `Verb` of the `operationId` should be or contain a specific value depending on the operation method:

| operation method | verb should contain | notes  |
| ---------------- | ------------------- | ------ |
| get              | "Get" or "List"     | should be "List" if response is pageable |
| put              | "Create" or "Update" | could be "CreateOrUpdate" |
| patch            | "Update"            | could be "CreateOrUpdate" |
| delete           | "Delete"            | |

### az-operation-security

Every operation should have a security requirement (may be defined globally).

### az-operation-summary-or-description

Operation should have a summary or description.

### az-pageable-post

Post operations that specify x-ms-pageable are problematic because it is unclear what http method
should be used with the `nextLink` URL.

### az-pagination-parameters

The `top`, `skip`, `maxpagesize`, `filter`, `orderby`, `select`, and `expand` parameters, if present, must follow Azure conventions.

### az-pagination-response

If the operation returns a list that is potentially large, it should [support pagination](../opeapi-style-guidelines.md#support-for-pagination).

### az-parameter-default-not-allowed

A required parameter should not specify a default value.

### az-parameter-description

All parameters should have a description.

### az-parameter-names-convention

Path and query parameter names should be camel case (except `api-version`); header parameter names should be kebab case.

### az-parameter-names-unique

All parameter names for an operation -- including parameters defined at the path level -- should be case-insensitive unique.

### az-parameter-order

Path parameters must be in the same order as in the path.

### az-patch-content-type

The request body content type for patch operations should be JSON merge patch.

Only patch operations should accept JSON merge patch.

### az-path-characters

Service-defined path segments should be restricted to 0-9 A-Z a-z - . _ ~, with : allowed only as described below to designate an action operation.

### az-path-parameter-names

Path parameter names should be consistent across all paths.

### az-path-parameter-schema

Path parameters should be defined as `type: string` with a `maxLength` and a `pattern` that restricts
the characters that can be be used in the parameter value.

### az-post-201-response

Using post for a create operation is discouraged.  Use put or patch instead.

### az-property-description

All schema properties should have a description.

### az-property-names-convention

Property names should be lowerCamelCase.

### az-put-path

The path for a put operation should have a path parameter as the final path segment.
This path parameter is the identifier of the resource to create or update.

### az-request-body-not-allowed

A get or delete operation must not accept a request body/body parameter.

A requestBody/body parameter should only be specified for HTTP methods where
the HTTP 1.1 specification [RFC7231][RFC7231] has explicitly defined semantics for request bodies.
RFC7231 states that the payload for both get and delete "has no defined semantics".

### az-request-body-optional

Flag a body parameter/request body that is not marked as required. This is a common oversight.

### az-response-body-type

Response body schema must not be a bare array.

### az-schema-description-or-title

All schemas should have a description or title.

### az-schema-names-convention

Schema names should be Pascal case.

### az-schema-type-and-format

Every schema should specify a well-defined combination of `type` and `format`.

`format` is required for type integer and number, optional for type string,
and not allowed for any other types.

The well-defined type/format combinations are:

**type: integer**

| format | description | comments |
| ------ | ----------- | -------- |
| int32  | signed 32 bits | from [oas2][oas2] |
| int64  | signed 64 bits | from [oas2][oas2] |
| unixtime | Unix time stamp | from [autorest][autorest] |

**type: number**

| format | description | comments |
| ------ | ----------- | -------- |
| float  | 32 bit floating point | from [oas2][oas2] |
| int64  | 64 bit floating point | from [oas2][oas2] |
| decimal | 128 bit floating point | from [autorest][autorest] |

**type: string**

| format | description | comments |
| ------ | ----------- | -------- |
| byte  | base64 encoded characters | from [oas2][oas2] |
| binary  | any sequence of octets | from [oas2][oas2] |
| date  | [RFC3339][rfc3339] full-date | from [oas2][oas2] |
| date-time  | [RFC3339][rfc3339] date-time | from [oas2][oas2] |
| password | sensitive value | from [oas2][oas2] |
| char |  | from [autorest][autorest] |
| time |  | from [autorest][autorest] |
| date-time-rfc1123 |  | from [autorest][autorest] |
| duration |  | from [autorest][autorest] |
| uuid |  | from [autorest][autorest] |
| base64url |  | from [autorest][autorest] |
| url |  | from [autorest][autorest] |
| odata-query |  | from [autorest][autorest] |
| certificate |  | from [autorest][autorest] |

oas2: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#data-types
autorest: https://github.com/Azure/autorest/blob/main/packages/libs/openapi/src/v3/formats.ts
rfc3339: https://xml2rfc.tools.ietf.org/public/rfc/html/rfc3339.html#anchor14

### az-security-definitions

Security definitions must be present and cannot be empty.

Security definitions must be either type: oauth2 or type: apiKey with in: header.

An oauth2 security scheme must define at least one scope, and all scopes must have a name that matches:
- https:\/\/[\w-]+(\.[\w-]+)+/[\w-.]+

### az-security-definition-description

Security definition / security scheme should have a description.

### az-security-min-length

A `security` property should contain at least one security requirement.

### az-security-requirement

Each property in a security requirement object must reference a defined security scheme.

The value of property in a security requirement that references an oauth2 security scheme must be a non-empty
array of scope names, each of which must also be defined in the referenced security scheme.

### az-success-response-body

All success responses except 202 and 204 should define a response body.

### az-success-response-nobody

Responses for status codes 202 and 204 should have no response body.

### az-top-default-not-allowed

The `top` query parameter should not have a default value. The service should return all results when `top` is not specified.

### az-version-convention

API version (`info.version`) should be a date in YYYY-MM-DD format, optionally suffixed with '-preview'.

### az-version-policy

API version should not be specified in path segment, and all operations should accept `api-version` query param with date value in YYYY-MM-DD format, optionally suffixed with '-preview'.

[RFC7231]: https://tools.ietf.org/html/rfc7231

### az-204-no-response-body

A 204 (No Content) response should have no response body.
