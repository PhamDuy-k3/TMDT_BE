import crypto from "node:crypto"; // mã hóa

export const hashString = (data, alg = "sha1") => {
 return crypto.createHmac(alg, "example").update(data).digest("hex"); // fomat theo chuẩn nào đó vi dụ hex
};
