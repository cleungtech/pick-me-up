import { notAcceptable } from "../customErrors.js";

export const checkAcceptJson = (req) => {
  const { accept } = req.headers;
  if (accept !== 'application/json')
    throw notAcceptable;
}