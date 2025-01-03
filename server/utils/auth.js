import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Export the utility functions and constants
export function throwAuthenticationError(text) {
  throw new GraphQLError(`${text}`, {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  });
}

// function for authenticated routes
export function authMiddleware({ req }) {
  // allows token to be sent via req.query or headers
  let token = req.query.token || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  // verify token and get user data out of it
  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
}

export function signToken({ username, email, _id }) {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
