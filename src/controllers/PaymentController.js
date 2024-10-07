import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";

export default class PaymentController {
  async create(req, res) {
    try {
      const { amount, orderInfo } = req.body;

      const accessKey = "F8BBA842ECF85";
      const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      const partnerCode = "MOMO";
      const redirectUrl = "http://localhost:3000/fe_shopee_user_reactJs";
      const ipnUrl =
        "https://d9b7-116-96-47-15.ngrok-free.app/payment/payment-result";
      const requestType = "payWithMethod";
      const orderId = partnerCode + new Date().getTime();
      const requestId = orderId;
      const extraData = "";
      const orderGroupId = "";
      const autoCapture = true;
      const lang = "vi";

      // Tạo chữ ký (signature) cho request
      const rawSignature =
        `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
        `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
        `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
        `&requestId=${requestId}&requestType=${requestType}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      // Tạo request body cho MoMo
      const requestBody = {
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        orderGroupId,
        signature,
      };

      // Gửi request đến MoMo API
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (result.resultCode === 0) {
        res.status(200).json({ payUrl: result.payUrl });
      } else {
        res.status(400).json({ message: "Payment initiation failed", result });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  async handlePaymentResult(req, res) {
    const paymentResult = req.body;
    res.status(200).json({ paymentResult });
  }
}
