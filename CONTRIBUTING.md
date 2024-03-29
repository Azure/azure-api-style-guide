# Contributing to the Azure API Style Guide

If you would like to become an active contributor to this project please follow the instructions in the
[Microsoft Azure Projects Contribution Guidelines](https://opensource.microsoft.com/collaborate/).

## Issues

- You are welcome to [submit an issue](https://github.com/azure/azure-api-style-guide/issues) with a bug report or a feature request.
- If you are reporting a bug, please indicate which version of the package you are using and provide steps to reproduce the problem.
- If you are submitting a feature request, please indicate if you are willing or able to submit a PR for it.

## Coding Style / Conventions

### JavaScript

JavaScript code in this project should follow the [AirBnB JavaScript Style Guide][] as enforced by the [ESLint][] tool
with the configuration file `.eslintrc.js` in the root of the project.

[AirBnB JavaScript Style Guide]: https://github.com/airbnb/javascript
[ESLint]: https://eslint.org/

### Markdown

Markdown files in this project should follow the style enforced by the [markdownlint tool][],
as configured by the `.markdownlint.json` file in the root of the project.

[markdownlint tool]: https://github.com/DavidAnson/markdownlint

### Spectral rules file

Rules in the Spectral rules file `spectral.yaml` should be listed in alphabetical order by rule name.

## Building and Testing

To build and test the project locally, clone the repo and issue the following commands

```sh
npm install
npm test
```

## Adding new rules to the Spectral ruleset

When you add a new rule there are a number of places you should consider including:

- `spectral.yaml` should define the new rule, possibly pointing to a new function used by the rule.
- `functions` directory to hold any new function for the rule.
- `test\<rulename>.test.js` should test at least the error and no-error cases of the rule.
- `openapi-style-guide.md` should be updated with the style guideline that the rule enforces.
- `docs/azure-ruleset.md` should describe the new rule.
- `docs/crossref.md` should be updated if the rule corresponds to an `azure-openapi-validator` rule.

## Code of Conduct

This project's code of conduct can be found in the
[CODE_OF_CONDUCT.md file](https://github.com/Azure/azure-api-style-guide/blob/main/CODE_OF_CONDUCT.md)
(v1.4.0 of the [CoC](https://contributor-covenant.org/)).
