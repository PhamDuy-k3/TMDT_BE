import jwt from "jsonwebtoken"; // sử dụng jsonwebtoken để xử lý JWT
import moment from "moment";

export function DecodeToken(authorization) {
  const token = authorization.split(" ")[1];

  // Kiểm tra token có hợp lệ không
  if (!token) {
    throw new Error("No token provided");
  }

  const decodedToken = jwt.decode(token, { complete: true });

  // Kiểm tra định dạng token
  if (!decodedToken || !decodedToken.header || !decodedToken.payload) {
    throw new Error("Invalid token format");
  }

  // Kiểm tra thời hạn của token
  if (moment().unix() > decodedToken.payload.exp) {
    throw new Error("Token has expired");
  }

  return decodedToken;
}
