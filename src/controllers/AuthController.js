import moment from "moment";
import userModel from "../models/user.model.js";
import crypto from "node:crypto"; // mã hóa
import { hashString } from "../commons/hash-data.js";
import { generateToken } from "../commons/generate-token.js";
import { UserService } from "../services/user.services.js";
import { GenerateRandomCode } from "../utils/generateRandomCode.js";

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
        isVerified: user.isVerified,
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
  async register(req, res) {
    try {
      const data = req.body;
      data.verificationCode = GenerateRandomCode();

      if (data.password) {
        data.password = hashString(data.password);
      }

      const userServices = new UserService();
      const user = await userServices.store(data);

      if (user) {
        // Trả về trạng thái thành công ngay lập tức
        res.json({
          data: user._id,
          status_code: 200,
          errors: [],
        });

        // Gửi email sau khi trả về kết quả (không chờ email gửi xong)
        userServices
          .sendEmail(data.email, data.verificationCode)
          .then(() => {
            console.log("Email sent successfully");
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          });
      } else {
        res.status(400).json({
          message: "User registration failed",
          errors: [],
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }
  async verify(req, res) {
    const { userId } = req.params;
    const data = req.body;
    const userServices = new UserService();
    const userUpdate = await userServices.update(userId, data);
    res.json({
      data: userUpdate,
      status_code: 200,
    });
  }
}
