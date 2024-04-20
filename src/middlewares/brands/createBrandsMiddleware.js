import Joi from "joi";
export default function CreateBrandsMiddleware(req, res, next) {
  const data = req.body; // lấy dũ liệu từ người dùng gửi lên
  const schema = Joi.object({
    name: Joi.string().max(255).required().messages({
      "string.base": "Tên brands là 1 chuỗi.",
      "string.max": "Tên brands không được vượt quá {{#limit}} ký tự.",
      "any.required": "Vui lòng nhập tên brands của bạn.",
    }),
    description: Joi.string().max(255).required().messages({
      "string.base": "description là 1 chuoi.",
      "string.max": "description không được vượt quá {{#limit}} ký tự.",
      "any.required": "Vui lòng nhập description của bạn.",
    }),
  });

  const result = schema.validate(data);

  if (result.error) {
    return res.status(422).json(result.error.details);
  }
  next();
}
