require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const path = require("path");

const auth = require("./middleware/authMiddleware")

const { Server } = require("socket.io");

const connectDB =
  require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use( "/uploads",express.static( path.join(__dirname, "..", "uploads")));

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/users",auth,
  require("./routes/userRoutes")
);

app.use(
  "/api/chat",auth,
  require("./routes/chatRoutes")
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});