import multer from "multer";
import path from "path";
import crypto from "crypto";

// Cấu hình lưu trữ tệp tin với Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Đặt thư mục lưu tệp tin
    const uploadDir =
      file.fieldname === "images"
        ? "/storage/images"
        : file.fieldname === "videos"
        ? "/storage/videos"
        : null;

    if (uploadDir) {
      cb(null, path.join(process.cwd(), uploadDir));
    } else {
      cb(new Error("Invalid field name"), false);
    }
  },
  filename: function (req, file, cb) {
    const uniquePrefix = crypto.randomBytes(16).toString("hex");
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png"];
  const allowedVideoTypes = ["video/mp4", "video/mpeg"];

  const isImage =
    file.fieldname === "images" && allowedImageTypes.includes(file.mimetype);
  const isVideo =
    file.fieldname === "videos" && allowedVideoTypes.includes(file.mimetype);

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

export const uploadImageAndVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // Giới hạn kích thước file là 10MB
  },
});
