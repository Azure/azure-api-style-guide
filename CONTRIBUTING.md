# Contributing to the Azure Spectral Ruleset

If you would like to become an active contributor to this project please follow the instructions in the
[Microsoft Azure Projects Contribution Guidelines](https://opensource.microsoft.com/collaborate/).

## Issues

- You are welcome to [submit an issue](https://github.com/azure/azure-spectral-ruleset/issues) with a bug report or a feature request.
- If you are reporting a bug, please indicate which version of the package you are using and provide steps to reproduce the problem.
- If you are submitting a feature request, please indicate if you are willing or able to submit a PR for it.

## Building and Testing

To build and test the project locally, clone the repo and issue the following commands

```sh
npm install
npm test
```

## Adding new rules

When you add a new rule there are a number of places you should consider including:

- `spectral.yaml` should define the new rule, possibly pointing to a new function used by the rule.
- `functions` directory to hold any new function for the rule.
- `test\<rulename>.test.js` should test at least the error and no-error cases of the rule.
- `openapi-style-guidelines.md` should be updated with the style guideline that the rule enforces.
- `docs/azure-ruleset.md` should describe the new rule.
- `docs/crossref.md` should be updated if the rule corresponds to an `azure-openapi-validator` rule.

## Code of Conduct

This project's code of conduct can be found in the
[CODE_OF_CONDUCT.md file](https://github.com/Azure/azure-sdk-for-python/blob/main/CODE_OF_CONDUCT.md)
(v1.4.0 of the [CoC](https://contributor-covenant.org/)).
