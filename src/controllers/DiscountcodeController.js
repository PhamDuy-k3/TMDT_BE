import discountcodeModel from "../models/discountcode.model.js";

export default class DiscountcodeController {
  async create(req, res) {
    try {
      const data = req.body;
      const file = req.file;

      if (file) {
        data.logoShop = file.filename;
      }

      const discountcodes = await discountcodeModel.create(data);

      res.status(200).json(discountcodes);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }

  async index(req, res) {
    try {
      const { selectedDiscountCodes } = req.query;
      const conditions = {};
      // if (selectedDiscountCodes) {
      //   const arrayCodes = selectedDiscountCodes.split(",");
      //   conditions.code = { $in: arrayCodes };
      // }
      conditions.usageLimit = { $gt: 0 };

      const discountcodeModels = await discountcodeModel.find(conditions);

      res.json({
        status_code: 200,
        data: discountcodeModels,
      });
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
  async updateStatus(req, res) {
    try {
      const discountcodesExpired = req.body;
      discountcodesExpired.forEach(async (discountcodeExpired) => {
        const discount_code_expired = await discountcodeModel.findByIdAndUpdate(
          discountcodeExpired,
          { status: "expired" },
          { new: true }
        );
        if (!discount_code_expired) {
          return res.status(404).json({ message: "Discount code not found" });
        }
      });

      res.json({
        status_code: 200,
        message: "Status updated successfully",
        data: discountcodeModel,
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
