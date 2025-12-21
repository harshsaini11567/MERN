import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/User.js";
import Message from "./models/Message.js";

dotenv.config();

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ================= BROWSER ROUTES =================
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public/chat.html"));
});

// ================= AUTH APIs =================
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashed });

  res.json({ success: true });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ error: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({ error: "Wrong password" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  res.json({ token, username });
});

// ================= SOCKET CHAT =================

const onlineUsers = {}; // username -> socketId

io.on("connection", socket => {

  socket.on("join", username => {
    socket.username = username;
    onlineUsers[username] = socket.id;

    //  Send updated list to everyone
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      delete onlineUsers[socket.username];

      // 🔥 Update list on disconnect
      io.emit("onlineUsers", Object.keys(onlineUsers));
    }
  });

  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    await Message.create({ sender, receiver, message });

    if (onlineUsers[receiver]) {
      io.to(onlineUsers[receiver]).emit("receiveMessage", {
        sender,
        message
      });
    }
  });

  app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

});



server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
