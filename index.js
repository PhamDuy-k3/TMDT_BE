import express from "express";
import { router } from "./Router/index.js";
import { connect } from "./config/database/mongo.js";
import cors from "cors";
import { createServer } from "http"; // Import createServer from http module
import { Server } from "socket.io"; // Import Server from socket.io

const app = express();

const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
  },
});

app.use(express.json());
app.use(cors());

connect();

router(app);

app.use(express.static("storage/user"));

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    // lấy dữ liệu từ client khi user send
    const messageWithTimestamp = {
      text: msg,
      timestamp: new Date().toISOString(),
    };
    socket.broadcast.emit("message", messageWithTimestamp); // gửi thông điệp này đến tất cả các client khác ngoại trừ sender
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5050, () => {
  console.log("server listening on port 5050");
});
