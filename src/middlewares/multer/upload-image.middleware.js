import multer from "multer";
//LÀ MỘT MIDDLEWARE CHO FILE

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/storage/user"); //process.cwd() lấy đường dẫn  đến thư mục
  }, //nơi luu tru
  filename: function (req, file, cb) {
    // tạo file name mới cho ảnh để ko bị ghi đè
    const uniquePrefix = Date.now() + "-" + Math.random(Math.random * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  const allowMimes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type invalid"));
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});
