import moment from "moment";
import userModel from "../../models/user.model.js";
import crypto from "node:crypto"; // mã hóa

export default async function AuthMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  if (!token) {
    res.json({
      error: {
        message: "Unauthorized",
      },
    });
    return;
  }
  const [headerBase64, payloadBase64, signature] = token.split(".");
  const header = JSON.parse(Buffer.from(headerBase64, "base64").toString());
  const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
  if (moment().unix() > payload.exp) {
    res.json({
      error: {
        message: "Token het han",
      },
    });
    return;
  }

  const signatureHashed = crypto
    .createHmac(header.alg, "example")
    .update(headerBase64 + "." + payloadBase64)
    .digest("hex");
  if (signature !== signatureHashed) {
    res.json({
      error: {
        message: "Token khong chinh xac",
      },
    });
    return;
  }
  const user = await userModel.findById(payload.id);
  if (!user) {
    throw new Error("User không tồn tại");
  }
  req.authUser = user;
  next();
}
