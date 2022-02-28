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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
