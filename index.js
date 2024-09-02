import express from "express";
import { router } from "./Router/index.js";
import { connect } from "./config/database/mongo.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";


const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connect();
router(app);

app.use(express.static("storage/user"));

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    const messageWithTimestamp = {
      ...msg,
      timestamp: new Date().toISOString(),
    };
    socket.broadcast.emit("message", messageWithTimestamp);
  });
  socket.on("comments", (cmt) => {
    const commentWithTimestamp = {
      ...cmt,
      timestamp: new Date().toISOString(),
    };
    console.log(commentWithTimestamp);

    socket.broadcast.emit("comments", commentWithTimestamp);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5050, () => {
  console.log("server listening on port 5050");
});
