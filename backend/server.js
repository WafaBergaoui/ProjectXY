import http from "http";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import {
  addUser,
  removeUserFromRoom,
  removeUser,
} from "./user.js";

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("conected to mongodb");
  })
  .catch((error) => {
    console.log("mongo error", error);
  });

app.use(cors({ origin: true }));
app.use("/api/users", userRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

const server = http.Server(app);
const io = new Server(server);

//Listen to events from client
io.on("connection", (socket) => {
  console.log("New connection", socket.id);
  socket.on("joinRoom", ({ user, room }) => {
    socket.join(room);
    addUser({
      username: user,
      room,
      id: socket.id,
    });
    socket.on("userPlayed", (data) => {
      socket.broadcast.to(room).emit("userPlayed", data);
    });

    socket.on("playAgain", (nextPlayer) => {
      io.to(room).emit("playAgain", nextPlayer);
    });

    socket.on("newChallenger", () => {
      socket.broadcast.to(room).emit("newChallenger");
    });

    socket.on("exitGame", (r) => {
      socket.broadcast.to(room).emit("exitGame");
      removeUserFromRoom(r);
    });

    socket.on("typing", () => {
      socket.broadcast.to(room).emit("typing");
    });

    socket.on("notTyping", () => {
      socket.broadcast.to(room).emit("notTyping");
    });

    socket.on("newMessage", (message) => {
      socket.broadcast.to(room).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      socket.broadcast.to(room).emit("exitGame");
    });
  });
});

server.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
