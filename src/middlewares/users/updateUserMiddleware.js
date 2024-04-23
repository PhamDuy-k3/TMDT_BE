import Joi from "joi";
export default function UpdateUserMiddleware(req, res, next) {
  const data = req.body; // lấy dũ liệu từ người dùng gửi lên
  console.log(data);
  const schema = Joi.object({
    name: Joi.string().max(50).required().messages({
      "string.base": "Tên là 1 chuỗi.",
      "string.max": "Tên không được vượt quá {{#limit}} ký tự.",
      "any.required": "Vui lòng nhập tên của bạn.",
    }),
    phone: Joi.string().max(11).min(9).required().messages({
      "string.base": "Phone là 1 chuỗi.",
      "string.max": "Số điện thoại không được vượt quá {{#limit}} ký tự.",
      "string.min": "Số điện thoại không được ít hơn {{#limit}} ký tự.",
      "any.required": "Vui lòng nhập số điện thoại của bạn.",
    }),
    email: Joi.string().max(50).email().required().messages({
      "string.base": "Email là 1 chuổi.",
      "string.max": "Email không được vượt quá {{#limit}} ký tự.",
      "string.email": "Email không hợp lệ, vui lòng kiểm tra lại.",
      "any.required": "Vui lòng nhập email của bạn.",
    }),
    gender: Joi.number().valid(1, 2).messages({
      "number.base": "Gender là 1 số.",
      "any.only": "Giới tính không hợp lệ.",
      "any.required": "Vui lòng chọn giới tính của bạn.",
    }),
    level: Joi.number().valid(1, 2).messages({
      "number.base": "lever là 1 số.",
      "any.only": "lever không hợp lệ.",
      "any.required": "Vui lòng chọn lever của bạn.",
    }),
    birthday: Joi.date().less("now").messages({
      "date.base": "Ngày sinh phải là kiểu ngày tháng.",
      "date.less": "Ngày sinh không được lớn hơn ngày hiện tại.",
    }),
    address: Joi.string().max(50).messages({
      "string.base": "Địa chỉ phải là chuỗi.",
      "string.max": "Địa chỉ không được vượt quá {{#limit}} ký tự.",
    }),
    province_id: Joi.alternatives().try(
      Joi.string().messages({
        "string.base": "Province ID phải là chuỗi hoặc số.",
        "any.required": "Vui lòng chọn province ID của bạn.",
      }),
      Joi.number().messages({
        "number.base": "Province ID phải là chuỗi hoặc số.",
        "any.required": "Vui lòng chọn province ID của bạn.",
      })
    ),
    district_id: Joi.alternatives().try(
      Joi.string().messages({
        "string.base": "district_id phải là chuỗi hoặc số.",
        "any.required": "Vui lòng chọn district_id của bạn.",
      }),
      Joi.number().messages({
        "number.base": "district_id phải là chuỗi hoặc số.",
        "any.required": "Vui lòng chọn district_id của bạn.",
      })
    ),
    town_id: Joi.alternatives().try(
      Joi.string().messages({
        "string.base": "town_id phải là chuỗi hoặc số.",
        "any.required": "Vui lòng chọn town_id của bạn.",
      }),
      Joi.number().messages({
        "number.base": "town_id phải là chuỗi hoặc số.",
        "any.required": "Vui lòng chọn town_id của bạn.",
      })
    ),
  });

  const result = schema.validate(data);

  if (result.error) {
    return res.status(422).json(result.error.details);
  }
  next();
}
