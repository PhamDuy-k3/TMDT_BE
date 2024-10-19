import jwt from "jsonwebtoken";

export function DecodeToken(authorization) {
  if (!authorization) {
    throw new Error("Authorization header is missing");
  }

  const token = authorization.split(" ")[1];

  const decodedToken = jwt.decode(token, { complete: true });

  if (!decodedToken) {
    throw new Error("Invalid token");
  }

  return decodedToken;
}
