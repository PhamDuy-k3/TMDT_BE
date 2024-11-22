import productModel from "../models/product.model.js";
import Variant from "../models/variants.model.js";

export const updateProductStock = async (carts) => {
  const stockUpdatePromises = carts.map(async (cart) => {
    const { product_id, quantity, size, color } = cart;

    // Tìm sản phẩm và variants theo id_product
    const product = await productModel.findById({ _id: product_id });
    const variants = await Variant.find({ product_id });

    if (!product) {
      throw new Error(`Sản phẩm với ID ${product_id} không tồn tại`);
    }
    product.soldCount += quantity;
    let variant = null;

    if (size && color) {
      variant = variants.find(
        (variant) => variant.color === color && variant.size === size
      );
    } else if (!size && color) {
      variant = variants.find((variant) => variant.color === color);
    }

    if (variant) {
      variant.quantity -= quantity;
      await variant.save();
    } else {
      throw new Error(
        `Không tìm thấy variant với màu ${color} và size ${size}`
      );
    }

    // Cập nhật số lượng sản phẩm
    await productModel.findByIdAndUpdate(
      { _id: product_id },
      {
        $inc: {
          // inc : tăng or giảm
          stock: -quantity,
          soldCount: quantity,
        },
      },
      { new: true }
    );

    return product;
  });

  await Promise.all(stockUpdatePromises);
};
