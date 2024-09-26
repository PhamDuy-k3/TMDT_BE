import { UserService } from "../services/user.services.js";
import { hashString } from "../commons/hash-data.js";
import sendCodeGmail from "../utils/codeGmail.js";
import { GenerateRandomCode } from "../utils/generateRandomCode.js";
export default class UserController {
  async create(req, res) {
    // xứ lý input
    try {
      const data = req.body;
      const file = req.file;
      if (file) {
        data.avatar = file.filename;
      }
      data.password = hashString(data.password);

      // thực hiện thêm mới user
      const userServices = new UserService();
      const user = await userServices.store(data);
      res.json({
        data: user,
        status_code: 200,
        errors: [],
      });
    } catch (error) {
      res.json(error);
    }
  }
  async show(req, res) {
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
  async update(req, res) {
    try {
      const data = req.body;
      const { userId } = req.params;
      const file = req.file;
      if (file) {
        data.avatar = file.filename;
      }
      if (data.password) {
        data.password = hashString(data.password);
      }
      const userServices = new UserService();
      const userUpdate = await userServices.update(userId, data);

      res.json({
        data: userUpdate,
        status_code: 200,
      });
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
  async delete(req, res) {
    try {
      const { userId } = req.params;
      const userServices = new UserService();

      const result = await userServices.delete(userId);

      res.json({
        status_code: 200,
        data: result,
      });
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
  async index(req, res) {
    try {
      //limit : so luong phan tu tren 1 trang
      //page: số trang
      const { limit = 10, page = 1, ...rest } = req.query;
      const userServices = new UserService();

      res.json(await userServices.getWithPaginate(limit, page, rest));
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }

  async sendCodeToGmail(req, res) {
    const code = GenerateRandomCode();
    const gmail = req.body.gmail;
    const userId = req.body.id_user;

    try {
      // Lưu mã code vào user
      const userServices = new UserService();
      const result = await userServices.update(userId, {
        verificationCode: code,
      });
      if (result) {
        // Gửi email với mã xác nhận
        await sendCodeGmail(gmail, code);

        res.status(200).json({
          status_code: 200,
          message: "Mã xác nhận đăng ký đã được gửi đến email",
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi mã xác nhận qua email:", error);
      res.status(500).json({
        error: {
          message: "Có lỗi xảy ra khi gửi email xác nhận.",
        },
      });
    }
  }
}
