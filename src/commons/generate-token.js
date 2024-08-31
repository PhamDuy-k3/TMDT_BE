import moment from "moment";
import crypto from "node:crypto"; // mã hóa

export const generateToken = (
  data,
  alg = "sha1",
  exp = moment().add(1, "months").unix()
) => {
  // tạo token
  const header = JSON.stringify({
    alg: alg,
    typ: "JWT",
  });
  const payload = JSON.stringify({
    ...data,
    iat: moment().unix(),
    exp: exp,
  });

  const payloadBase64 = Buffer.from(payload)
    .toString("base64")
    .replace("==", "")
    .replace("=", "");

  const headerBase64 = Buffer.from(header)
    .toString("base64")
    .replace("==", "")
    .replace("=", "");
  const signature = crypto
    .createHmac("sha1", "example")
    .update(headerBase64 + "." + payloadBase64)
    .digest("hex");

  //trả vê token
  return `${headerBase64}.${payloadBase64}.${signature}`;
};
