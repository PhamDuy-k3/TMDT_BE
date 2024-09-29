import moment from "moment";
import crypto from "crypto"; // mã hóa

export const generateToken = (
  data, //id
  secretKey = "example",
  alg = "HS256",
  exp = moment().add(1, "minutes").unix()
) => {
  // Tạo header và payload cho token
  const header = {
    alg: alg,
    typ: "JWT",
  };

  const payload = {
    ...data,
    iat: moment().unix(),
    exp: exp,
  };

  // Mã hóa Base64 URL header và payload
  const headerBase64 = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  // Tạo chữ ký (signature) bằng thuật toán HMAC với SHA256
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(`${headerBase64}.${payloadBase64}`)
    .digest("hex");

  // Trả về token (header.payload.signature)
  return `${headerBase64}.${payloadBase64}.${signature}`;
};
