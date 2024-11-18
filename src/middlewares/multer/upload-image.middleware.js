// import multer from "multer";
// import path from "path";
// import crypto from "crypto";

// // Cấu hình lưu trữ tệp tin với Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Đặt thư mục lưu tệp tin
//     const uploadDir =
//       file.fieldname === "images"
//         ? "/storage/images"
//         : file.fieldname === "videos"
//         ? "/storage/videos"
//         : null;

//     if (uploadDir) {
//       cb(null, path.join(process.cwd(), uploadDir));
//     } else {
//       cb(new Error("Invalid field name"), false);
//     }
//   },
//   filename: function (req, file, cb) {
//     const uniquePrefix = crypto.randomBytes(16).toString("hex");
//     cb(null, `${uniquePrefix}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
//   const allowedVideoTypes = ["video/mp4", "video/mpeg"];
//   console.log("file.fieldname",file.fieldname);
//   const isImage =
//     file.fieldname === "images" && allowedImageTypes.includes(file.mimetype);
//   const isVideo =
//     file.fieldname === "videos" && allowedVideoTypes.includes(file.mimetype);

//   if (isImage || isVideo) {
//     cb(null, true);
//   } else {
//     cb(new Error("Unsupported file type"), false);
//   }
// };

// export const uploadImageAndVideo = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 1024 * 1024 * 10, // Giới hạn kích thước file là 10MB
//   },
// });

import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

// Cấu hình cho các field và loại MIME hợp lệ
const uploadConfig = {
  images: {
    path: "/storage/images",
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
  },
  image: {
    path: "/storage/images",
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
  },
  avatar: {
    path: "/storage/images",
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
  },
  videos: {
    path: "/storage/videos",
    allowedTypes: ["video/mp4", "video/mpeg"],
  },
  logoShop: {
    path: "/storage/logos",
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
  },
};

// Kiểm tra và tạo thư mục nếu chưa tồn tại
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Cấu hình lưu trữ tệp tin với Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const config = uploadConfig[file.fieldname];

    if (config) {
      const uploadDir = path.join(process.cwd(), config.path);
      ensureDirectoryExistence(uploadDir); // Tạo thư mục nếu chưa tồn tại
      cb(null, uploadDir);
    } else {
      cb(new Error("Invalid field name"), false);
    }
  },
  filename: function (req, file, cb) {
    const uniquePrefix = crypto.randomBytes(16).toString("hex");
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

// Bộ lọc tệp tin
const fileFilter = (req, file, cb) => {
  const config = uploadConfig[file.fieldname];

  if (config && config.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// Khởi tạo middleware upload
export const uploadImageAndVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // Giới hạn kích thước file là 10MB
  },
});
