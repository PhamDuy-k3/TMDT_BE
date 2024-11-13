import Variant from "../models/variants.model.js";

export default class VariantController {
  async create(req, res) {
    try {
      const data = req.body;
      const Variants = await Variant.create(data);
      res.json(Variants);
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
  //   async show(req, res) {
  //     try {
  //       const { VariantId } = req.params;
  //       const Variant = await Variant.findById(VariantId);
  //       res.json({
  //         data: Variant,
  //       });
  //     } catch (error) {
  //       res.json(error);
  //     }
  //   }
  async index(req, res) {
    try {
      const { product_id } = req.query;
      const Variants = await Variant.find({ product_id });
      res.json({
        data: Variants,
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
