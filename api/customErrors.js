// Error code: 400
const missingRequiredProperty = new Error('Missing at least one required property in the body');
const userAlreadyExist = new Error('User with this email already exists');
const invalidEmailFormat = new Error('Provided email is not valid');
const passwordTooWeak = new Error('Provided password is too weak');
const invalidPrice = new Error('Price must be a number');
const invalidInventory = new Error('Inventory must be an non-negative integer');


// Error code: 401
const invalidToken = new Error('Missing or invalid authorization token')
const invalidLogin = new Error('Invalid username and/or password');

// Error code: 403
const forbidden = new Error('Forbidden - You don\'t have permission to access this resource');

// Error code: 404
const notFound = new Error('Not Found');

// Error code: 405
const invalidMethod = new Error('Method Not Allowed');

// Error code: 406
const notAcceptable = new Error('Accept header must include application/json');

// Error code: 500
const serverError = new Error('Internal Server Error');

const handleErrors = (err, res) => {

  try {
    if (err.code === 'credentials_required' || err.code === 'invalid_token')
      throw invalidToken;
    throw err;

  } catch (err) {
    switch (err) {
      case missingRequiredProperty:
      case userAlreadyExist:
      case invalidEmailFormat:
      case passwordTooWeak:
      case invalidPrice:
      case invalidInventory:
        res.status(400);
        break;
      case invalidToken:
      case invalidLogin:
        res.status(401);
        break;
      case forbidden:
        res.status(403);
        break;
      case notFound:
        res.status(404);
        break;
      case invalidMethod:
        res.status(405);
        break;
      case notAcceptable:
        res.status(406);
        break;
      default:
        res.status(500);
        res.set('Content-Type', 'application/json');
        res.json({ Error: serverError.message });
        return;
    }
    res.set('Content-Type', 'application/json');
    res.json({ Error: err.message });
  }
}

export {
  serverError,
  invalidLogin,
  notAcceptable,
  missingRequiredProperty,
  userAlreadyExist,
  invalidEmailFormat,
  passwordTooWeak,
  notFound,
  invalidToken,
  forbidden,
  invalidMethod,
  invalidPrice,
  invalidInventory,
  handleErrors,
}