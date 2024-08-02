import userModel from "../models/user.model.js";

export class UserService {
  async store(user) {
    return await userModel.create(user);
  }
  async getById(userId) {
    return await userModel.findById(userId);
  }
  async update(userId, data) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User ko tồn tại");
    }
    // vì email và phone là duy nhất nên nếu ko có thay đổi gì
    // thì xóa khỏi data trc khi update

    if (user.email === data.email) {
      delete data.email;
    }
    if (user.phone === data.phone) {
      delete data.phone;
    }
    //console.log("data", data);
    const userUpdate = await userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });
    return userUpdate;
  }
  async delete(userId) {
    return await userModel.findByIdAndDelete(userId);
  }
  async getWithPaginate(limit, page, params) {
    const { name, gender, level, phone } = params;
    const offset = (page - 1) * limit;
    const conditions = {}; // Chứa các tham số lọc

    if (name) {
      conditions.name = new RegExp(`${name}`, "i"); // Lọc theo tên, không phân biệt chữ hoa và chữ thường
    }
    if (gender) {
      conditions.gender = gender; // Lọc chính xác theo giới tính
    }
    if (level) {
      conditions.level = level; // Lọc chính xác theo level
    }
    if (phone) {
      conditions.phone = new RegExp(phone);
    }
    // Chạy các tác vụ bất đồng bộ cùng một lúc để tăng hiệu suất
    const [count, users] = await Promise.all([
      userModel.countDocuments(conditions),
      userModel.find(conditions).limit(limit).skip(offset),
    ]);

    const pagination = Math.ceil(count / limit);

    return {
      data: users,
      count,
      limit: +limit,
      page: +page,
      pagination,
    };
  }
}
