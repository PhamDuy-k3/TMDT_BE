import moment from "moment";
import userModel from "../models/user.model.js";
import crypto from "node:crypto"; // mã hóa
import { hashString } from "../commons/hash-data.js";
import { generateToken } from "../commons/generate-token.js";
import { UserService } from "../services/user.services.js";
import { GenerateRandomCode } from "../utils/generateRandomCode.js";
import dayjs from "dayjs";
import refreshTokenModel from "../models/refreshToken.model.js";
import { generateRefreshToken } from "../commons/generate-refreshToken.js";
import jwt from "jsonwebtoken";

export default class AuthController {
  // Đăng nhập
  async login(req, res) {
    try {
      const { phone, password } = req.body;

      // Kiểm tra sự tồn tại của người dùng qua số điện thoại
      const user = await userModel.findOne({ phone });
      if (!user) {
        return res.status(401).json({
          error: {
            message: "Thông tin đăng nhập không chính xác", // Không tiết lộ chi tiết
          },
        });
      }

      // Kiểm tra mật khẩu
      if (password) {
        const passwordHashed = hashString(password);

        // Sử dụng crypto.timingSafeEqual để bảo mật so sánh chuỗi
        const passwordBuffer = Buffer.from(passwordHashed, "utf-8");
        const userPasswordBuffer = Buffer.from(user.password, "utf-8");

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

      // Tạo refreshToken cho người dùng
      const refreshToken = generateRefreshToken({ id: user._id });

      // Xóa refresh token cũ nếu có trước khi lưu token mới
      await refreshTokenModel.deleteMany({ userId: user._id });

      // Lưu refresh token vào MongoDB
      const newRefreshToken = {
        userId: user._id,
        refreshToken: refreshToken,
      };
      const RefreshToken = await refreshTokenModel.create(newRefreshToken);

      // Trả về thông tin người dùng cùng token
      return res.status(200).json({
        user_token: token,
        refresh_token: refreshToken,
        isVerified: user.isVerified,
        codeExpired: user.codeExpired,
      });
    } catch (error) {
      // Xử lý các lỗi bất ngờ
      return res.status(500).json({
        error: {
          message: "Đã có lỗi xảy ra trong qua trình login",
          details: error.message,
        },
      });
    }
  }

  // Đăng ký
  async register(req, res) {
    try {
      const data = req.body;

      // Tạo mã xác thực ngẫu nhiên
      data.verificationCode = GenerateRandomCode();

      // Đặt thời gian hết hạn mã xác thực
      data.codeExpired = dayjs().add(5, "minutes");

      // Mã hóa mật khẩu nếu có
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
            console.log("Email đã gửi thành công");
          })
          .catch((error) => {
            console.error("Lỗi khi gửi email:", error);
          });
      } else {
        res.status(400).json({
          message: "Đăng ký người dùng thất bại",
          errors: [],
        });
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error);
      res.status(500).json({
        message: "Lỗi máy chủ nội bộ",
        error: error.message,
      });
    }
  }

  // tim kiêm tk cần xác thực
  async searchRegister(req, res) {
    try {
      const { userId } = req.params;
      const userServices = new UserService();
      const user = await userServices.getById(userId);
      res.json({
        data: user,
      });
    } catch (error) {
      res.json(error);
    }
  }
  // Xác thực tài khoản
  async verify(req, res) {
    try {
      const { userId } = req.params;
      const data = req.body;
      const userServices = new UserService();
      const userUpdate = await userServices.update(userId, data);

      res.json({
        data: userUpdate,
        status_code: 200,
      });
    } catch (error) {
      console.error("Lỗi trong quá trình xác thực:", error);
      res.status(500).json({
        message: "Lỗi máy chủ nội bộ",
        error: error.message,
      });
    }
  }
  async checkToken(req, res) {
    res.status(200).json({
      message: "token còn hạn",
    });
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json("Refresh Token Required");

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return res.status(403).json("Invalid Token");
        console.log(payload);
        const newAccessToken = generateToken({
          id: payload.id,
        });

        if (!newAccessToken) {
          return res.status(500).json("Token mới tạo không thành công");
        }

        return res.json({ accessToken: newAccessToken });
      }
    );
  }
}
