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
    const userUpdate = await userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });
    return userUpdate;
  }
  async delete(userId) {
    return await userModel.findByIdAndDelete(userId);
  }
  async getWithPaginate(limit, page, params) {
    //count: số lượng phần tử của database
    const { name, gender, level } = params;
    const offset = (page - 1) * limit;
    const conditions = {}; // chưa các tham số lọc
    if (name) {
      conditions.name = new RegExp(`${name}`); // d ->duy , dung  lọc tương quan
    }
    if (gender) {
      conditions.gender = gender; // lọc chính xác
    }
    if (level) {
      conditions.level = level; // lọc chính xác
    }
    // chưa các tác vụ bất đồng bộ , dùng như này tăng hiệu suất
    const [count, users] = await Promise.all([
      userModel.countDocuments(conditions),
      userModel.find(conditions).limit(limit).skip(offset),
    ]);
    const pagination = Math.ceil(count / limit);
    // truy xuất số lượng phần tử dựa trên limit và offset
    return {
      data: users,
      count,
      limit: +limit,
      page: +page,
      pagination,
    };
  }
}
