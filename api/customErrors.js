const serverError = new Error('Internal Server Error');
const invalidLogin = new Error('Invalid username and/or password');
const notAcceptable = new Error('Accept header must include application/json');
const missingRequiredProperty = new Error('Missing at least one required property in the body');
const userAlreadyExist = new Error('User with this email already exists');
const invalidEmailFormat = new Error('Provided email is not valid');
const passwordTooWeak = new Error('Provided password is too weak');

export {
  serverError,
  invalidLogin,
  notAcceptable,
  missingRequiredProperty,
  userAlreadyExist,
  invalidEmailFormat,
  passwordTooWeak,
}