import moment from "moment";
import userModel from "../models/user.model.js";
import crypto from "node:crypto"; // mã hóa
import { hashString } from "../commons/hash-data.js";
import { generateToken } from "../commons/generate-token.js";

export default class AuthController {
  async login(req, res) {
    try {
      const { phone, password } = req.body;

      // Kiểm tra sự tồn tại của người dùng qua số điện thoại
      const user = await userModel.findOne({ phone });
      if (!user) {
        return res.status(401).json({
          error: {
            message: "Thông tin đăng nhập không chính xác", // Không tiết lộ thông tin cụ thể về số điện thoại
          },
        });
      }

      // Kiểm tra mật khẩu
      if (password) {
        const passwordHashed = hashString(password);

        // Sử dụng crypto.timingSafeEqual để bảo mật hơn khi so sánh chuỗi
        const passwordBuffer = Buffer.from(passwordHashed, "utf-8");
        const userPasswordBuffer = Buffer.from(user.password, "utf-8");

        // console.log(passwordBuffer);
        if (!crypto.timingSafeEqual(passwordBuffer, userPasswordBuffer)) {
          return res.status(401).json({
            error: {
              message: "Thông tin đăng nhập không chính xác", // Không tiết lộ chi tiết
            },
          });
        }
      }

      // Tạo token cho người dùng
      const token = generateToken({ id: user._id });

      // Trả về thông tin người dùng cùng token
      return res.status(200).json({
        user_token: token,
        phone_user: user.phone,
        id_user: user._id,
      });
    } catch (error) {
      // Xử lý các lỗi bất ngờ
      return res.status(500).json({
        error: {
          message: "Đã có lỗi xảy ra, vui lòng thử lại sau.",
          details: error.message, // Gửi chi tiết lỗi cho mục đích gỡ lỗi
        },
      });
    }
  }
}
