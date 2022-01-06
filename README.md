# Azure API Style Guide

This repository contains a [Style Guide for OpenAPI definitions](./openapi-style-guide.md) of Azure services.
The Style Guide is a companion to the [Azure API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md), the [OpenAPI 2.0 specification](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md), and the [OpenAPI 3.1 specification](https://spec.openapis.org/oas/v3.1.0).

The repository also contains a [Spectral](https://github.com/stoplightio/spectral) ruleset to check 
an API definition for conformance to the Azure API Guidelines and this Style Guide. 

> **NOTE:** It is highly recommended that you leverage the Spectral rule set. Azure service teams have found Spectral to be very useful identifying many common mistakes that affect the overall quality of their Open API documentation. It's one of the first things the API Stewardship Board turns to when revieing an API specification. 
> 
> However, the errors, warnings, and info messages identified by Spectral should be evaluated in the context of *your service*, and using *your judgement*. If you have any questions, concerns, or comments, please don't hesitate to start a discussion in the [API Stewardship Teams Channel](https://teams.microsoft.com/l/channel/19%3a3ebb18fded0e47938f998e196a52952f%40thread.tacv2/General?groupId=1a10b50c-e870-4fe0-8483-bf5542a8d2d8&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47).

## How to use the Spectral Ruleset

### Dependencies

The Spectral Ruleset requires Node version 14 or later.

### Install Spectral

`npm install -g @stoplightio/spectral-cli`

### Usage

You can specify the ruleset directly on the command line:

`spectral lint -r https://raw.githubusercontent.com/azure/azure-api-style-guide/main/spectral.yaml <api definition file>`

Or you can create a Spectral configuration file (`.spectral.yaml`) that references the ruleset:

```yaml
extends:
  - https://raw.githubusercontent.com/azure/azure-api-style-guide/main/spectral.yaml
```

### Example

```bash
spectral lint -r https://raw.githubusercontent.com/azure/azure-api-style-guide/main/spectral.yaml petstore.yaml
```

### Using the Spectral VSCode extension

There is a [Spectral VSCode extension](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral) that will run the Spectral linter on an open API definition file and show errors right within VSCode.  You can use this ruleset with the Spectral VSCode extension.

1. Install the Spectral VSCode extension from the extensions tab in VSCode.
2. Create a Spectral configuration file (`.spectral.yaml`) in the root directory of your project
as shown above.
3. Set `spectral.rulesetFile` to the name of this configuration file in your VSCode settings.

Now when you open an API definition in this project, it should highlight lines with errors.
You can also get a full list of problems in the file by opening the "Problems panel" with "View / Problems".  In the Problems panel you can filter to show or hide errors, warnings, or infos.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
