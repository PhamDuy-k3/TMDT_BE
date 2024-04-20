import Joi from "joi";
export default function LoginMiddleware(req, res, next) {
  const data = req.body; // lấy dũ liệu từ người dùng gửi lên
  const schema = Joi.object({
    email: Joi.string().max(50).email().required().messages({
      "string.base": "Email là 1 chuổi.",
      "string.max": "Email không được vượt quá {{#limit}} ký tự.",
      "string.email": "Email không hợp lệ, vui lòng kiểm tra lại.",
      "any.required": "Vui lòng nhập email của bạn.",
    }),
    password: Joi.number().required().messages({
      "number.base": "pass là 1 số.",
      "any.required": "Vui lòng chọn giới tính của bạn.",
    }),
  });

  const result = schema.validate(data);

  if (result.error) {
    return res.status(422).json(result.error.details);
  }
  next();
}
