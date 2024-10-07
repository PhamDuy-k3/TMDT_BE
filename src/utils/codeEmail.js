import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Tạo transporter với thông tin email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Hàm gửi email xác nhận
async function sendCodeToEmail(toEmail, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Xác nhận đăng ký",
    html: `
      <p>Chào bạn,</p>
      <p>Đây là mã xác nhận đăng ký của bạn:</p>
      <p><strong>Mã xác nhận: ${code}</strong></p>
      <p>Xin cảm ơn!</p>
    `,
  };

  try {
    // Gửi email và đợi phản hồi từ transporter
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    throw new Error("Không thể gửi email xác nhận.");
  }
}

export default sendCodeToEmail;
