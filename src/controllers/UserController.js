import { UserService } from "../services/user.services.js";
import { hashString } from "../commons/hash-data.js";
export default class UserController {
  async create(req, res) {
    // xứ lý input
    try {
      const data = req.body;
      const file = req.file;
      data.avatar = file.filename;
      data.password = hashString("123456789");

      // thực hiện thêm mới user
      const userServices = new UserService();

      const user = await userServices.store(data);

      res.json(user);
    } catch (error) {
      res.json(error);
    }
  }
  async show(req, res) {
    try {
      const { userId } = req.params;
      const userServices = new UserService();
      const user = await userServices.getById(userId);
      res.json(user);
    } catch (error) {
      res.json(error);
    }
  }
  async update(req, res) {
    try {
      const data = req.body;
      const { userId } = req.params;

      const userServices = new UserService();
      const userUpdate = await userServices.update(userId, data);

      res.json(userUpdate);
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

      res.json(result);
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
}
