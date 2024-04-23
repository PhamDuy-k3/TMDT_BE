import Joi from "joi";
export default function LoginMiddleware(req, res, next) {
  const data = req.body; // lấy dũ liệu từ người dùng gửi lên
  const schema = Joi.object({
    phone: Joi.string().max(11).min(9).required().messages({
      "string.base": "Phone là 1 chuỗi.",
      "string.max": "Số điện thoại không được vượt quá {{#limit}} ký tự.",
      "string.min": "Số điện thoại không được ít hơn {{#limit}} ký tự.",
      "any.required": "Vui lòng nhập số điện thoại của bạn.",
    }),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .messages({
        "string.base": "Mật khẩu phải là một chuỗi.",
        "string.pattern.base":
          "Mật khẩu không hợp lệ, chỉ chấp nhận các ký tự chữ cái (viết hoa hoặc viết thường) và chữ số.",
        "any.required": "Vui lòng nhập mật khẩu của bạn.",
      }),
  });

  const result = schema.validate(data);

  if (result.error) {
    return res.status(422).json(result.error.details);
  }
  next();
}
