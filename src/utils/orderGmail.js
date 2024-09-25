import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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

function sendOrderConfirmationGmail(toEmail, orderDetails) {
  const itemsDetails =
    orderDetails?.carts
      ?.map(
        (item) =>
          `<div>
            <p><strong>Tên sản phẩm:</strong> ${item.name}</p>
            <p><strong>Số tiền:</strong> ${item.price} VNĐ</p>
            <p><strong>Màu sắc:</strong> ${item.color}</p>
            <p><strong>Kích cỡ:</strong> ${item.size}</p>
            <p><strong>Số lượng:</strong> ${item.quantity}</p>
            <p><strong>Hình ảnh:</strong> <img src="${item.image}" alt="${item.name}" width="100"></p>
            <hr>
          </div>`
      )
      .join("") || "<p>Thông tin sản phẩm không có</p>";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Xác nhận đơn hàng của bạn",
    html: `
      <p>Cảm ơn bạn đã đặt hàng!</p>
      <p>Đây là chi tiết đơn hàng của bạn:</p>
      ${itemsDetails}
      <p><strong>Tổng số tiền:</strong> ${orderDetails.total_prices} VNĐ</p>
      
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

export default sendOrderConfirmationGmail;
