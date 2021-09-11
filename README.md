# Azure API Style Guide

This repository contains a [Style Guide for OpenAPI definitions](./openapi-style-guide.md) of Azure services.
The Style Guide is a companion to the [Azure API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md) and the [OpenAPI 2.0 specification]().

The repository also contains a [Spectral](https://github.com/stoplightio/spectral) ruleset to check 
an API definition for conformance to the Azure API Guidelines and this Style Guide. 

## How to use the Spectral Ruleset

### Install Spectral

`npm install -g @stoplightio/spectral`

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
