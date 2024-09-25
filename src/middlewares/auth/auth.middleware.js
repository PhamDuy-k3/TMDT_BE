import moment from "moment";
import userModel from "../../models/user.model.js";
import crypto from "crypto"; // mã hóa
import jwt from "jsonwebtoken"; // sử dụng jsonwebtoken để xử lý JWT

export default async function AuthMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    // Kiểm tra header authorization có tồn tại
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        error: {
          message: "Unauthorized: Missing or invalid token",
        },
      });
    }

    const token = authorization.split(" ")[1];

    // Kiểm tra token có hợp lệ không
    if (!token) {
      return res.status(401).json({
        error: {
          message: "Unauthorized: No token provided",
        },
      });
    }

    // Giải mã token và kiểm tra thời hạn
    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken) {
      return res.status(400).json({
        error: {
          message: "Invalid token format",
        },
      });
    }

    const { header, payload, signature } = decodedToken;

    // Kiểm tra thời hạn của token
    if (moment().unix() > payload.exp) {
      return res.status(401).json({
        error: {
          message: "Token has expired",
        },
      });
    }

    // Tạo lại chữ ký từ header và payload để kiểm tra
    const signatureHashed = crypto
      .createHmac(header.alg, "example") // Sử dụng khóa bí mật "example"
      .update(`${header}.${payload}`)
      .digest("hex");

    if (signature !== signatureHashed) {
      return res.status(401).json({
        error: {
          message: "Token signature does not match",
        },
      });
    }

    // Tìm kiếm người dùng theo ID từ payload của token
    const user = await userModel.findById(payload.id);
    if (!user) {
      return res.status(404).json({
        error: {
          message: "User not found",
        },
      });
    }

    // Lưu thông tin người dùng vào request để sử dụng trong các middleware sau
    req.authUser = user;
    next();
  } catch (error) {
    // Xử lý bất kỳ lỗi nào trong quá trình xác thực
    return res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
}
