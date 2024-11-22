import productModel from "../models/product.model.js";
import Variant from "../models/variants.model.js";
import { UpdateStockProduct } from "../utils/updateStockProduct.js";

export default class VariantController {
  async create(req, res) {
    try {
      const data = req.body;
      const variant = await Variant.create(data);
      if (!variant) {
        return res
          .status(400)
          .json({ error: { message: "Không thể tạo biến thể" } });
      }
      await UpdateStockProduct("", variant.product_id, "", res);
      res.status(200).json(variant);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error.message || "Đã xảy ra lỗi máy chủ",
        },
      });
    }
  }
  async update(req, res) {
    try {
      const data = req.body;
      const { _id: id_variant, product_id } = data;

      const variant = await UpdateStockProduct(
        id_variant,
        product_id,
        data,
        res
      );

      res.status(200).json({
        data: variant,
      });
    } catch (error) {
      res.status(500).json({
        error: {
          message: error.message || "Đã xảy ra lỗi máy chủ",
        },
      });
    }
  }

  async show(req, res) {
    try {
      const { VariantId } = req.params;
      const Variant = await Variant.findById(VariantId);
      res.json({
        data: Variant,
      });
    } catch (error) {
      res.json(error);
    }
  }
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
  async delete(req, res) {
    try {
      const data = req.body;

      const result = await Variant.findByIdAndDelete(data._id);
      await UpdateStockProduct("", data.product_id, "", res);
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
}
