import Address from "../models/address.model.js";

export default class AddressController {
  async create(req, res) {
    try {
      const data = req.body;
      const userId = req.authUser?._id.toString();
      if (!userId) {
        return res.json({ error: "Người dùng chưa được xác thực" });
      }
      data.user_id = userId;
      const address = await Address.create(data);
      res.json.status(200)(address);
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
      const address = await Address.find({});
      res.json({
        data: address,
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
}
