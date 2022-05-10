// Check conformance to Azure guidelines for pagination parameters:
// - if present, `top` must be an integer, optional, with no default value
// - if present, `skip` must be an integer, optional, with a default value of 0
// - if present, `maxpagesize` must be an integer, optional, with no default value
// - if present, `filter` must be a string and optional
// - if present, `orderby` should be be an array of strings and optional
// - if present, `select` should be be an array of strings and optional
// - if present, `expand` should be be an array of strings and optional

module.exports = (operation, _opts, paths) => {
  // operation should be a get or post operation
  if (operation === null || typeof operation !== 'object') {
    return [];
  }
  const path = paths.path || paths.target || [];

  // If the operation has no parameters, there is nothing to check
  if (!operation.parameters) {
    return [];
  }

  const errors = [];

  // Check the top parameter
  const topIndex = operation.parameters.findIndex((param) => param.name?.toLowerCase() === 'top');
  if (topIndex !== -1) {
    const top = operation.parameters[topIndex];
    // Improper casing of top will be flagged by the az-parameter-names-convention rule
    // Check that top is an integer
    if (top.type !== 'integer') {
      errors.push({
        message: 'top parameter must be type: integer',
        path: [...path, 'parameters', topIndex, 'type'],
      });
    }
    // Check that top is optional
    if (top.required) {
      errors.push({
        message: 'top parameter must be optional',
        path: [...path, 'parameters', topIndex, 'required'],
      });
    }
    // Check that top has no default value
    if (top.default !== undefined) {
      errors.push({
        message: 'top parameter must have no default value',
        path: [...path, 'parameters', topIndex, 'default'],
      });
    }
  }

  // Check skip parameter
  const skipIndex = operation.parameters.findIndex((param) => param.name?.toLowerCase() === 'skip');
  if (skipIndex !== -1) {
    const skip = operation.parameters[skipIndex];
    // Improper casing of skip will be flagged by the az-parameter-names-convention rule
    // Check that skip is an integer
    if (skip.type !== 'integer') {
      errors.push({
        message: 'skip parameter must be type: integer',
        path: [...path, 'parameters', skipIndex, 'type'],
      });
    }
    // Check that skip is optional
    if (skip.required) {
      errors.push({
        message: 'skip parameter must be optional',
        path: [...path, 'parameters', skipIndex, 'required'],
      });
    }
    // Check that skip has a default value of 0
    if (skip.default !== 0) {
      errors.push({
        message: 'skip parameter must have a default value of 0',
        path: [...path, 'parameters', skipIndex, 'default'],
      });
    }
  }

  // Check maxpagesize parameter
  const maxpagesizeIndex = operation.parameters.findIndex((param) => param.name?.toLowerCase() === 'maxpagesize');
  if (maxpagesizeIndex !== -1) {
    const maxpagesize = operation.parameters[maxpagesizeIndex];
    // Check case convention for maxpagesize
    if (maxpagesize.name !== 'maxpagesize') {
      errors.push({
        message: 'maxpagesize parameter must be named "maxpagesize" (all lowercase)',
        path: [...path, 'parameters', maxpagesizeIndex, 'name'],
      });
    }
    // Check that maxpagesize is an integer
    if (maxpagesize.type !== 'integer') {
      errors.push({
        message: 'maxpagesize parameter must be type: integer',
        path: [...path, 'parameters', maxpagesizeIndex, 'type'],
      });
    }
    // Check that maxpagesize is optional
    if (maxpagesize.required) {
      errors.push({
        message: 'maxpagesize parameter must be optional',
        path: [...path, 'parameters', maxpagesizeIndex, 'required'],
      });
    }
    // Check that maxpagesize has no default value
    if (maxpagesize.default !== undefined) {
      errors.push({
        message: 'maxpagesize parameter must have no default value',
        path: [...path, 'parameters', maxpagesizeIndex, 'default'],
      });
    }
  }

  // Check filter parameter
  const filterIndex = operation.parameters.findIndex((param) => param.name?.toLowerCase() === 'filter');
  if (filterIndex !== -1) {
    const filter = operation.parameters[filterIndex];
    // Improper casing of filter will be flagged by the az-parameter-names-convention rule
    // Check that filter is a string
    if (filter.type !== 'string') {
      errors.push({
        message: 'filter parameter must be type: string',
        path: [...path, 'parameters', filterIndex, 'type'],
      });
    }
    // Check that filter is optional
    if (filter.required) {
      errors.push({
        message: 'filter parameter must be optional',
        path: [...path, 'parameters', filterIndex, 'required'],
      });
    }
  }

  // Check orderby parameter
  const orderbyIndex = operation.parameters.findIndex((param) => param.name?.toLowerCase() === 'orderby');
  if (orderbyIndex !== -1) {
    const orderby = operation.parameters[orderbyIndex];
    // Check case convention for orderby
    if (orderby.name !== 'orderby') {
      errors.push({
        message: 'orderby parameter must be named "orderby" (all lowercase)',
        path: [...path, 'parameters', orderbyIndex, 'name'],
      });
    }
    // Check that orderby is an array of strings
    if (orderby.type !== 'array' || orderby.items?.type !== 'string') {
      errors.push({
        message: 'orderby parameter must be type: array with items of type: string',
        path: [...path, 'parameters', orderbyIndex, 'type'],
      });
    }
    // Check that orderby is optional
    if (orderby.required) {
      errors.push({
        message: 'orderby parameter must be optional',
        path: [...path, 'parameters', orderbyIndex, 'required'],
      });
    }
  }

  // Check select parameter
  const selectIndex = operation.parameters.findIndex((param) => param.name?.toLowerCase() === 'select');
  if (selectIndex !== -1) {
    const select = operation.parameters[selectIndex];
    // Improper casing of select will be flagged by the az-parameter-names-convention rule
    // Check that select is an array of strings
    if (select.type !== 'array' || select.items?.type !== 'string') {
      errors.push({
        message: 'select parameter must be type: array with items of type: string',
        path: [...path, 'parameters', selectIndex, 'type'],
      });
    }
    // Check that select is optional
    if (select.required) {
      errors.push({
        message: 'select parameter must be optional',
        path: [...path, 'parameters', selectIndex, 'required'],
      });
    }
  }

  // Check expand parameter
  const expandIndex = operation.parameters.findIndex((param) => param.name?.toLowerCase() === 'expand');
  if (expandIndex !== -1) {
    const expand = operation.parameters[expandIndex];
    // Improper casing of expand will be flagged by the az-parameter-names-convention rule
    // Check that expand is an array of strings
    if (expand.type !== 'array' || expand.items?.type !== 'string') {
      errors.push({
        message: 'expand parameter must be type: array with items of type: string',
        path: [...path, 'parameters', expandIndex, 'type'],
      });
    }
    // Check that expand is optional
    if (expand.required) {
      errors.push({
        message: 'expand parameter must be optional',
        path: [...path, 'parameters', expandIndex, 'required'],
      });
    }
  }

  return errors;
};
