const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral');

const rulesetURI = `${__dirname}/../spectral.yaml`;

async function linterForRule(rule) {
  const linter = new Spectral();
  linter.registerFormat('oas2', isOpenApiv2);
  linter.registerFormat('oas3', isOpenApiv3);
  await linter.loadRuleset(rulesetURI);
  Object.keys(linter.rules).forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    linter.rules[key].enabled = (key === rule);
  });
  return linter;
}

module.exports.linterForRule = linterForRule;
