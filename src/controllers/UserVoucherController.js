import User_vouchers from "../models/user_voucher.model.js";

export default class UserVoucherController {
  async create(req, res) {
    try {
      const data = req.body;
      const userId = req.authUser?._id.toString();

      if (!userId) {
        return res.status(400).json({
          error: {
            message: "User ID is required.",
          },
        });
      }

      data.user_id = userId;
      const id_voucher = data.voucher_id;

      const existingVoucher = await User_vouchers.findOne({
        user_id: userId,
        voucher_id: id_voucher,
      });

      if (existingVoucher) {
        return res.status(409).json({
          error: {
            message: "Voucher này đã được lưu trước đó rồi.",
          },
        });
      }

      const user_vouchers = await User_vouchers.create(data);

      return res.status(201).json({
        data: user_vouchers,
      });
    } catch (error) {
      return res.status(400).json({
        error: {
          message: error.message,
        },
      });
    }
  }
  async index(req, res) {
    try {
      const userId = req.authUser?._id.toString();

      if (!userId) {
        return res.status(400).json({
          error: {
            message: "User ID là bắt buộc.",
          },
        });
      }
      const existingVouchers = await User_vouchers.find({
        user_id: userId,
      });

      if (!existingVouchers.length) {
        return res.status(404).json({
          message: "Không tìm thấy voucher nào cho người dùng này.",
        });
      }

      return res.status(200).json({
        data: existingVouchers,
      });
    } catch (error) {
      // Xử lý bất kỳ lỗi nào xảy ra trong quá trình xử lý yêu cầu
      return res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }
}
