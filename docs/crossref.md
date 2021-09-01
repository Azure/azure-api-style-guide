# Cross Reference Azure Spectral Rules with azure-openapi-validator

| Rule Name | Rule ID | Azure Spectral Ruleset |
| --------- | ------- | ---------------------- |
| [OperationIdNounInVerb][r1001] | R1001 | [az-operation-id](./azure-ruleset.md#az-operation-id) |
| [ListInOperationName][r1003] | R1003 | [az-operation-id](./azure-ruleset.md#az-operation-id) |
| [GetInOperationName][r1005] | R1005 | [az-operation-id](./azure-ruleset.md#az-operation-id) |
| [PutInOperationName][r1006] | R1006 | [az-operation-id](./azure-ruleset.md#az-operation-id) |
| [PatchInOperationName][r1007] | R1007 | [az-operation-id](./azure-ruleset.md#az-operation-id) |
| [DeleteInOperationName][r1009] | R1009 | [az-operation-id](./azure-ruleset.md#az-operation-id) |
| [AvoidMSDNReferences][r1010] | R1010 |  |
| [HttpsSupportedScheme][r1011] | R1011 | Add |
| [AvoidNestedProperties][r2001] | R2001 | Add |
| [ValidFormats][r2003] | R2003 | Add |
| [NonApplicationJsonType][r2004] | R2004 | |
| [LongRunningResponseStatusCode][r2005] | R2005 | Add |
| [ControlCharactersNotAllowed][r2006] | R2006 |  |
| [LongRunningOperationsWithLongRunningExtension][r2007] | R2007 | Add |
| [MutabilityWithReadOnlyRule][r2008] | R2008 |  |
| [ArraySchemaMustHaveItems][r2009] | R2009 | Add |
| [LongRunningOperationsOptionsValidator][r2010] | R2010 | Add ? |
| [XmsClientNameParameter][r2012] | R2012 |  |
| [XmsClientNameProperty][r2013] | R2013 |  |
| [SubscriptionIdParameterInOperations][r2014] | R2014 |  |
| [ParameterNotDefinedInGlobalParameters][r2015] | R2015 | add for api-version |
| [PatchBodyParametersSchema][r2016] | R2016 | Add |
| [PutRequestResponseScheme][r2017] | R2017 |  |
| [XmsEnumValidation][r2018] | R2018 | Add |
| [resourceHasXMsResourceEnabled][r2019] | R2019 |  |
| [requiredPropertiesMissingInResourceModel][r2020] | R2020 |  |
| [SummaryAndDescriptionMustNotBeSame][r2023] | R2023 | Add |
| [AnonymousBodyParameter][r2024] | R2024 | Add |
| [NextLinkPropertyMustExist][r2025] | R2025 | [az-pagination-response](./azure-ruleset.md#az-pagination-response) |
| [AvoidAnonymousTypes][r2026] | R2026 | Add |
| [DefaultMustBeInEnum][r2027] | R2027 | Add |
| [NonEmptyClientName][r2028] | R2028 |  |
| [PageableOperation][r2029] | R2029 | [az-pagination-response](./azure-ruleset.md#az-pagination-response) |
| [InvalidVerbUsed][r2044] | R2044 | Spectral:oas |
| [NamePropertyDefinitionInParameter][r2047] | R2047 | Spectral:oas |
| [SecurityDefinitionsStructure][r2054] | R2054 |  |
| [OneUnderscoreInOperationId][r2055] | R2055 | [az-operation-id](./azure-ruleset.md#az-operation-id) |
| [requiredReadOnlyProperties][r2056] | R2056 | Add |
| [InvalidSkuModel][r2057] | R2057 |  |
| [XmsPathsMustOverloadPaths][r2058] | R2058 |  |
| [PageableRequires200Response][r2060] | R2060 |  |
| [XmsResourceInPutResponse][r2062] | R2062 | |
| [OperationIdNounConflictingModelNames][r2063] | R2063 | Add |
| [LROStatusCodesReturnTypeSchema][r2064] | R2064 | Add |
| [LicenseHeaderMustNotBeSpecified][r2065] | R2065 |  |
| [PostOperationIdContainsUrlVerb][r2066] | R2066 | Add |
| [BodyTopLevelProperties][r3006] | R3006 | |
| [PutGetPatchResponseSchema][r3007] | R3007 | [az-consistent-response-body](./azure-ruleset.md#az-consistent-response-body) |
| [CollectionObjectPropertiesNaming][r3008] | R3008 | Add |
| [TrackedResourceListByImmediateParent][r3010] | R3010 |  |
| [DescriptionMustNotBeNodeName][r3011] | R3011 | Add |
| [APIVersionPattern][r3012] | R3012 | [az-version-convention](./azure-ruleset.md#az-version-convention) |
| [DeleteMustNotHaveRequestBody][r3013] | R3013 | [az-request-body-not-allowed](./azure-ruleset.md#az-request-body-not-allowed) |
| [BodyPropertiesNamesCamelCase][r3014] | R3014 | [az-property-names-convention](./azure-ruleset.md#az-property-names-convention) |
| [EnumMustHaveType][r3015] | R3015 | Add |
| [DefinitionsPropertiesNamesCamelCase][r3016] | R3016 | [az-property-names-convention](./azure-ruleset.md#az-property-names-convention) |
| [GuidUsage][r3017] | R3017 |  |
| [EnumInsteadOfBoolean][r3018] | R3018 |  |
| [ARMResourcePropertiesBag][r3019] | R3019 |  |
| [PathResourceProviderNamePascalCase][r3020] | R3020 |  |
| [PathResourceTypeNameCamelCase][r3021] | R3021 |  |
| [OperationsAPIImplementation][r3023] | R3023 |  |
| [EnumUniqueValue][r3024] | R3024 | Add |
| [TrackedResourceGetOperation][r3025] | R3025 | |
| [TrackedResourcePatchOperation][r3026] | R3026 | |
| [TrackedResourceListByResourceGroup][r3027] | R3027 |  |
| [TrackedResourceListBySubscription][r3028] | R3028 |  |
| [EnumMustNotHaveEmptyValue][r3024] | R3024 | Add |
| [PathResourceProviderMatchNamespace][r3030] | R3030  | |
| [XmsPageableListByRGAndSubscriptions][r3060] | R3060 |  |
| [ParameterDescriptionRequired][r4000] | R4000 | [az-parameter-description](./azure-ruleset.md#az-parameter-description) |
| [XmsParameterLocation][r4001] | R4001 | Add |
| [LocationMustHaveXmsMutability][r4002] | R4002 |  |
| [OperationIdRequired][r4004] | R4004 | spectral:oas operation-operationId |
| [UniqueXmsEnumName][r4005] | R4005 | Add |
| [DeprecatedXmsCodeGenerationSetting][r4006] | R4006 |  |
| [DefaultErrorResponseSchema][r4007] | R4007 | [az-default-response](./azure-ruleset.md#az-default-response) |
| [AvoidEmptyResponseSchema][r4008] | R4008 | Add |
| [requiredReadOnlySystemData][r4009] | R4009 | |
| [requiredDefaultResponse][r4010] | R4010 | [az-error-response](./azure-ruleset.md#az-error-response) |
| [DeleteOperationResponses][r4011] | R4011 | [az-delete-204-response](./azure-ruleset.md#az-delete-204-response) |
| [XmsPageableMustHaveCorrespondingResponse][r4012] | R4012 | [az-pagination-response](./azure-ruleset.md#az-pagination-response) |
| [IntegerTypeMustHaveFormat][r4013] | R4013 | Add |
| [AllResourcesMustHaveGetOperation][r4014] | R4014 |  |
| [NestedResourcesMustHaveListOperation][r4015] | R4015 |  |
| [TopLevelResourcesListByResourceGroup][r4016] | R4016 |  |
| [TopLevelResourcesListBySubscription][r4017] | R4017 | |
| [OperationsApiResponseSchema][r4018] | R4018 |  |
| [GetCollectionResponseSchema][r4019] | R4019 | Add |
| [DescriptiveDescriptionRequired][r4000-3] | R4000-3 | Add |
| [DescriptionAndTitleMissing][r4021] | R4021 | [az-schema-description-or-title](./azure-ruleset.md#az-schema-description-or-title) |
| [OperationDescriptionOrSummaryRequired][r4000-5] | R4000-5 | Add |
| [PreviewVersionOverOneYear][r4024] | R4024 |  |
| [ValidResponseCodeRequired][r4028] | R4028 | Add |
| [UniqueClientParameterName][r4029] | R4029 |  |
| [UniqueXmsExample][r4030] | R4030 |  |
| [MissingXmsErrorResponse][r4032] | R4032 | [az-error-response](./azure-ruleset.md#az-error-response) |
| [UniqueModelName][r4033] | R4033 | Add |
| [AzureResourceTagsSchemaValidation][r4034] | R4034 |  |
| [PrivateEndpointResourceSchemaValidation][r4035] | R4035 |  |
| [ImplementPrivateEndpointAPIs][r4036] | R4036 |  |
| [MissingTypeObject][r4037] | R4037 | Add |

[r1001]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r1001
[r1003]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r1003
[r1005]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r1005
[r1006]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r1006
[r1007]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r1007
[r1009]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r1009
[r1010]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r1010
[r1011]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r1011
[r2001]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2001
[r2003]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2003
[r2004]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2004
[r2005]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2005
[r2006]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2006
[r2007]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2007
[r2008]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2008
[r2009]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2009
[r2010]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2010
[r2012]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2012
[r2013]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2013
[r2014]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2014
[r2015]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2015
[r2016]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2016
[r2017]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2017
[r2018]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2018
[r2019]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2019
[r2020]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2020
[r2023]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2023
[r2024]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2024
[r2025]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2025
[r2026]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2026
[r2027]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2027
[r2028]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2028
[r2029]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2029
[r2044]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2044
[r2047]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2047
[r2054]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2054
[r2055]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2055
[r2056]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2056
[r2057]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2057
[r2058]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2058
[r2060]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2060
[r2062]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2062
[r2063]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2063
[r2064]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2064
[r2065]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2065
[r2066]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2066
[r3006]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3006
[r3007]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3007
[r3008]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3008
[r3010]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3010
[r3011]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3011
[r3012]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3012
[r3013]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3013
[r3014]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3014
[r3015]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3015
[r3016]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3016
[r3017]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3017
[r3018]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3018
[r3019]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3019
[r3020]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3020
[r3021]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3021
[r3023]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3023
[r3024]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3024
[r3025]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3025
[r3026]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3026
[r3027]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3027
[r3028]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3028
[r3029]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3029
[r3030]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#R3030
[r3060]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r3060
[r4000]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4000
[r4001]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4001
[r4002]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4002
[r4004]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4004
[r4005]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4005
[r4006]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4006
[r4007]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4007
[r4008]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4008
[r4009]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4009
[r4010]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4010
[r4011]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4011
[r4012]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4012
[r4013]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4013
[r4014]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4014
[r4015]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4015
[r4016]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4016
[r4017]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4017
[r4018]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4018
[r4019]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4019
[r4020]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4000-3
[r4021]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4000-4
[r4022]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4000-4
[r4024]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4024
[r4028]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4028
[r4029]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4029
[r4030]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4030
[r4032]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4032
[r4033]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4033
[r4034]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4034
[r4035]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4035
[r4036]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4036
[r4037]: https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r4037
