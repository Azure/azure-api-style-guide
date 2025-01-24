const { expect } = require('@jest/globals');

// Extend jest matchers with a method to check if an array contains an object
// that matches the expected object. Matching means that actual object contains
// all properties of the expected object with the same values.
function toContainMatch(actual, expected) {
  if (!Array.isArray(actual)) {
    throw new TypeError('Actual value must be an array!');
  }

  const index = actual.findIndex((item) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    Object.keys(expected).every((key) => this.equals(item[key], expected[key])));

  const pass = index !== -1;
  const message = () => `expected ${this.utils.printReceived(actual)} to contain object ${this.utils.printExpected(expected)}`;

  return { message, pass };
}

expect.extend({
  toContainMatch,
});
