import express from "express";
import { router } from "./Router/index.js";
import { connect } from "./config/database/mongo.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

connect();

router(app);

app.use(express.static("storage/user"));

//khởi tạo server
app.listen(5050, () => {
  console.log("sever listening on port 3000");
});
