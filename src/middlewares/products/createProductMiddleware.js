import Joi from "joi";
export default function CreateProductMiddleware(req, res, next) {
  const data = req.body; // lấy dũ liệu từ người dùng gửi lên
  console.log(data)
  const schema = Joi.object({
    name: Joi.string().max(255).required().messages({
      "string.base": "Tên SP là 1 chuỗi.",
      "string.max": "Tên SP không được vượt quá {{#limit}} ký tự.",
      "any.required": "Vui SP lòng nhập tên của bạn.",
    }),
    prices: Joi.number().required().messages({
      "string.base": "Price là 1 số.",
      "any.required": "Vui lòng nhập số điện thoại của bạn.",
    }),
    discount: Joi.number().min(0).max(100).required().messages({
      "string.base": "Discount là 1 số.",
      "string.max": "Discount không được vượt quá {{#limit}} ký tự.",
      "string.min": "Discount không được thấp hơn {{#limit}} ký tự.",
      "any.required": "Vui lòng nhập Discount của bạn.",
    }),
    category_id: Joi.string().messages({
      "number.base": "category_id là 1 chuoi.",
      "any.required": "Vui lòng chọn category_id.",
    }),
    brand_id: Joi.string().messages({
      "number.base": "brand_id là 1 chuoi.",
      "any.required": "Vui lòng chọn brand_id của bạn.",
    }),
  });

  const result = schema.validate(data);

  if (result.error) {
    return res.status(422).json(result.error.details);
  }
  next();
}
