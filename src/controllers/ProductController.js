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
      const file = req.file;
      if (file) {
        data.image = file.filename;
      }

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
  async updateIncreaseLike(req, res) {
    try {
      const { productId, userId } = req.params;

      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error("Product không tồn tại");
      }
      if (product.likedBy.includes(userId)) {
        return res.status(200).json({
          success: false,
          message: "User has already liked this product.",
        });
      }
      // Increment the likes field
      product.likedBy.push(userId);

      const productUpdate = await product.save();

      res.json({
        success: true,
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
  async updateDecreaseLike(req, res) {
    try {
      const { productId, userId } = req.params;

      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Sản phẩm không tồn tại",
        });
      }

      const userIndex = product.likedBy.indexOf(userId);
      if (userIndex !== -1) {
        product.likedBy.splice(userIndex, 1);

        const productUpdate = await product.save();

        return res.status(200).json({
          success: true,
          message: "Đã xóa lượt thích của người dùng.",
          data: productUpdate,
        });
      }

      return res.status(200).json({
        success: false,
        message: "Người dùng chưa thích sản phẩm này.",
      });
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
      const {
        limit = 2,
        page = 1,
        name,
        prices,
        category_id,
        sortOrder,
      } = req.query;
      const offset = (page - 1) * limit;
      const conditions = {}; // chứa các tham số lọc

      if (name) {
        conditions.name = new RegExp(`${name}`, "i"); // "i" để không phân biệt chữ hoa chữ thường
      }

      if (prices) {
        conditions.prices = { $gte: parseInt(prices) }; // tìm sản phẩm có giá lớn hơn hoặc bằng giá nhập vào
      }

      if (category_id) {
        conditions.category_id = category_id;
      }

      let sortOption = {};
      if (sortOrder === "asc") {
        sortOption = { prices: 1 }; // sắp xếp tăng dần
      } else if (sortOrder === "desc") {
        sortOption = { prices: -1 }; // sắp xếp giảm dần
      }

      // thực hiện các tác vụ bất đồng bộ để tăng hiệu suất
      const [count, products] = await Promise.all([
        productModel.countDocuments(conditions),
        productModel
          .find(conditions)
          .limit(limit)
          .skip(offset)
          .sort(sortOption), // sắp xếp giá theo thứ tự tăng dần hoặc giảm dần
      ]);

      // count: số lượng phần tử trong cơ sở dữ liệu
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
