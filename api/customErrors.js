const serverError = new Error('Internal Server Error');
const invalidLogin = new Error('Invalid username and/or password');
const notAcceptable = new Error('Accept header must include application/json')

export {
  serverError,
  invalidLogin,
  notAcceptable,
}