import ChatRoom from "../models/chatRoom.model.js";
import Message from "../models/message.model.js";

export default class ChatController {
  // Định nghĩa phương thức create
  async create(req, res) {
    const adminId = req.body;
    const userId = req.authUser?._id.toString();
    try {
      const chatRoom = await ChatRoom.create({ userId, adminId });
      res.status(201).json({
        data: chatRoom,
        status_code: 200,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo phòng chat", error });
    }
  }
  async admin_create(req, res) {
    const adminId = req.authUser?._id.toString();
    const userId = req.body;
    try {
      const chatRoom = await ChatRoom.create({ userId, adminId });
      res.status(201).json({
        data: chatRoom,
        status_code: 200,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo phòng chat", error });
    }
  }

  async createMessInRoom(req, res) {
    const { chatRoomId, sender, content } = req.body;

    try {
      const message = await Message.create({ sender, content, chatRoomId });

      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) {
        return res.status(404).json({ message: "Không tìm thấy phòng chat" });
      }

      chatRoom.messages.push(message._id);
      await chatRoom.save();

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi gửi tin nhắn", error });
    }
  }
  async getMessInRoom(req, res) {
    const { chatRoomId } = req.params;

    try {
      const chatRoom = await ChatRoom.findById(chatRoomId).populate("messages");

      if (!chatRoom) {
        return res.status(404).json({ message: "Không tìm thấy phòng chat" });
      }

      res.status(200).json(chatRoom.messages);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy tin nhắn", error });
    }
  }
  async getRoom(req, res) {
    try {
      const user_id = req.authUser?._id.toString();

      const condition = {};

      if (user_id) {
        condition.userId = user_id;
      }

      const chatRoom = await ChatRoom.findOne(condition);

      if (!chatRoom) {
        return res.status(200).json({
          data: chatRoom,
          status_code: 201,
        });
      }

      return res.status(200).json({
        data: chatRoom,
        status_code: 200,
      });
    } catch (error) {
      return res.status(500).json({ message: "Đã xảy ra lỗi server", error });
    }
  }
  async getRoomAdmin(req, res) {
    try {
      const {user_id} = req.query;

      const condition = {};

      if (user_id) {
        condition.userId = user_id;
      }

      const chatRoom = await ChatRoom.findOne(condition);

      if (!chatRoom) {
        return res.status(200).json({
          data: chatRoom,
          status_code: 201,
        });
      }

      return res.status(200).json({
        data: chatRoom,
        status_code: 200,
      });
    } catch (error) {
      return res.status(500).json({ message: "Đã xảy ra lỗi server", error });
    }
  }
}
