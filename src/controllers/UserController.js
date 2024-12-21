import { UserService } from "../services/user.services.js";
import { hashString } from "../commons/hash-data.js";
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
  async update_user(req, res) {
    try {
      const data = req.body;
      const userId = req.authUser?._id.toString();
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
  async profile(req, res) {
    try {
      const userId = req.authUser?._id.toString();
      const userServices = new UserService();
      const user = await userServices.getById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.json({
        data: user,
      });
    } catch (error) {
      res.json(error);
    }
  }
}
