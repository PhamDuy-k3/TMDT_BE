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
  async update(req, res) {
    try {
      const { id_address } = req.params;
      const data = req.body;
      const address = await Address.findById(id_address);
      if (!address) {
        return res.json({ error: "Địa chỉ không tồn tại" });
      }
      const addressUpdate = await Address.findByIdAndUpdate(id_address, data, {
        new: true,
      });
      res.json({
        data: addressUpdate,
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
  async index(req, res) {
    try {
      const userId = req.authUser?._id.toString();
      const address = await Address.find({ user_id: userId });
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
  async updateOneAddressToTrue(req, res) {
    try {
      const { id_address } = req.params;
      const address = await Address.findById(id_address);
      if (!address) {
        return res.json({ error: "Địa chỉ không tồn tại" });
      }
      const data = { default: true };
      const addressUpdate = await Address.findByIdAndUpdate(id_address, data, {
        new: true,
      });
      res.json({
        data: addressUpdate,
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
  async updateAllDefaultAddressesToFalse(req, res) {
    try {
      const userId = req.authUser?._id.toString();

      const result = await Address.updateMany(
        { user_id: userId, default: true },
        { $set: { default: false } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({
          error: {
            message: "Không tìm thấy địa chỉ nào để cập nhật.",
          },
        });
      }

      res.json({
        data: result,
        status_code: 200,
      });
    } catch (error) {
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }

  async getAddressDefaultIsTrue(req, res) {
    try {
      const userId = req.authUser?._id.toString();
      const address = await Address.find({ user_id: userId, default: true });
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
