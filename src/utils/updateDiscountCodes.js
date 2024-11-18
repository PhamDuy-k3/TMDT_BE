import discountcodeModel from "../models/discountcode.model.js";
import User_vouchers from "../models/user_voucher.model.js";

export const updateDiscountCodes = async (selectedDiscountCodes) => {
  const discountUpdatePromises = selectedDiscountCodes.map(async (code) => {
    // Giảm số lượng voucher trong kho
    const discountCode = await discountcodeModel.findOne({ code });
    if (!discountCode) {
      throw new Error(`Mã giảm giá ${code} không hợp lệ`);
    }
    if (discountCode.stock > 0) {
      await discountcodeModel.updateOne(
        { code: code },
        { $inc: { stock: -1 } }
      );
    }

    // Giảm số lượng voucher của user
    const _id = discountCode._id;
    const voucher_user = await User_vouchers.findOne({ voucher_id: _id });
    if (voucher_user && voucher_user.quantity > 0) {
      await User_vouchers.updateOne(
        { voucher_id: _id },
        { $inc: { quantity: -1 } }
      );
    }
  });

  // Chờ tất cả các promise cập nhật mã giảm giá hoàn tất
  await Promise.all(discountUpdatePromises);
};
