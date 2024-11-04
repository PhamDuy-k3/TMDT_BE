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
      res.json(discountcodes);
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
}
