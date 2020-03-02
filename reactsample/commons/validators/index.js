export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);
export const required = value => (value ? undefined : "Required");
export const isNotEmpty = value => (value !== [] ? undefined : "Required");
export const isNumber = value =>
  isNaN(value) ? "Should be a number" : undefined;
export const minValue = min => value =>
  isNaN(value) || value < min ? `Minimum value is ${min}` : undefined;
