import productModel from "../models/product.model.js";
import Variant from "../models/variants.model.js";

export const UpdateStockProduct = async (id_variant, product_id, data, res) => {
  // Cập nhật biến thể theo ID
  let variant = null;

  if (data !== "" && id_variant !== null) {
    variant = await Variant.findByIdAndUpdate(id_variant, data, {
      new: true,
    });
    if (!variant) {
      return res
        .status(404)
        .json({ error: { message: "Không tìm thấy biến thể" } });
    }
  }

  // Lấy tổng số lượng của tất cả các biến thể thuộc sản phẩm
  const variants = await Variant.find({ product_id });
  const stockProduct = variants.reduce(
    (acc, variant) => acc + variant.quantity,
    0
  );

  // Kiểm tra sự tồn tại của sản phẩm
  const product = await productModel.findById(product_id);
  if (!product) {
    return res
      .status(404)
      .json({ error: { message: "Không tìm thấy sản phẩm" } });
  }

  // Cập nhật stock của sản phẩm
  const productUpdate = await productModel.findByIdAndUpdate(
    product_id,
    { $set: { stock: stockProduct } },
    { new: true }
  );

  return variant;
};
