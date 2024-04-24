import productModel from "../models/product.model.js";

export default class ProductController {
  async create(req, res) {
    try {
      const data = req.body;
      const file = req.file;
      if (file) {
        data.image = file.filename;
      }

      const product = await productModel.create(data);
      res.json({
        data: product,
        status_code: 200,
        errors: [],
      });
    } catch (error) {
      res.json(error);
    }
  }
  async delete(req, res) {
    try {
      const { productId } = req.params;
      const result = await productModel.findByIdAndDelete(productId);

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
  async show(req, res) {
    try {
      const { productId } = req.params;
      const product = await productModel.findById(productId);
      res.json({
        data: product,
      });
    } catch (error) {
      res.json(error);
    }
  }

  async update(req, res) {
    try {
      const data = req.body;
      const { productId } = req.params;
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error("Product ko tồn tại");
      }
      // if (product.name === data.name) {
      //   delete data.name;
      // }
      const productUpdate = await productModel.findByIdAndUpdate(
        productId,
        data,
        {
          new: true,
        }
      );
      res.json({
        data: productUpdate,
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
      const { limit = 2, page = 1, name, prices } = req.query;
      const offset = (page - 1) * limit;
      const conditions = {}; // chưa các tham số lọc
      if (name) {
        conditions.name = new RegExp(`${name}`, "i"); // "i" để không phân biệt chữ hoa chữ thường
      }
      if (prices) {
        conditions.prices = { $gte: parseInt(prices) }; // Tìm sản phẩm có giá lớn hơn or = giá nhập vào
      }
      // chưa các tác vụ bất đồng bộ , dùng như này tăng hiệu suất
      const [count, products] = await Promise.all([
        productModel.countDocuments(conditions),
        productModel.find(conditions).limit(limit).skip(offset),
      ]);
      //count: số lượng phần tử trong database
      // truy xuất số lượng phần tử dựa trên limit và offset

      const pagination = Math.ceil(count / limit);

      res.json({
        data: products,
        count,
        limit: +limit,
        page: +page,
        pagination,
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
