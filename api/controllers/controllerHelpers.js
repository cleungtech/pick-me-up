import {
  notAcceptable,
  invalidMethod,
} from "../customErrors.js";

const checkAcceptJson = (req) => {
  const { accept } = req.headers;
  if (accept !== 'application/json')
    throw notAcceptable;
}

const invalidHttpMethod = (allowedMethods) => 
  (req, res, next) => {
    try {
      console.log(allowedMethods);
      res.set('Accept', allowedMethods);
      throw invalidMethod;

    } catch (err) {
      next(err);
    }

}

export {
  checkAcceptJson,
  invalidHttpMethod,
}