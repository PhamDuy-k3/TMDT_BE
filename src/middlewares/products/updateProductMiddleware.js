import Joi from "joi";
export default function UpdateProductMiddleware(req, res, next) {
  const data = req.body; // lấy dũ liệu từ người dùng gửi lên
  const schema = Joi.object({
    name: Joi.string().max(255).messages({
      "string.base": "Tên SP là 1 chuỗi.",
      "string.max": "Tên SP không được vượt quá {{#limit}} ký tự.",
    }),
    prices: Joi.number().messages({
      "string.base": "Price là 1 số.",
    }),
    stock: Joi.number().required().messages({
      "string.base": "stock là 1 số.",
      "any.required": "Vui lòng nhập tổng số lượng sản phẩm.",
    }),
    discount: Joi.number().min(0).max(100).messages({
      "string.base": "Discount là 1 số.",
      "string.max": "Discount không được vượt quá {{#limit}} ký tự.",
      "string.min": "Discount không được thấp hơn {{#limit}} ký tự.",
    }),
    createdAt: Joi.date().messages({
      "date.base": "createdAt là kiểu ngày tháng.",
    }),
    category_id: Joi.string().messages({
      "number.base": "category_id là 1 số.",
    }),

    brand_id: Joi.string().messages({
      "number.base": "brand_id là 1 số.",
    }),
  });

  const result = schema.validate(data);

  if (result.error) {
    return res.status(422).json(result.error.details);
  }
  next();
}
