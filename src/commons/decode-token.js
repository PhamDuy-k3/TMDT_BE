import jwt from "jsonwebtoken"; // sử dụng jsonwebtoken để xử lý JWT

export function DecodeToken(authorization) {
  const token = authorization.split(" ")[1];
  const decodedToken = jwt.decode(token, { complete: true });
  return decodedToken;
}
