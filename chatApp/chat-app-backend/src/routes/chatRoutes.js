const express = require("express");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/createConverstion", async (req, res) => {
  const { senderId, receiverId } = req.body;

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  // If not, create new one
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }
  res.json(conversation);
});

router.post("/sendMessage", upload.single("file"),async (req, res) => {

    const { conversationId, senderId, text } = req.body;

    const message = await Message.create({
      conversationId,
      senderId,
      text: text || "",

      fileUrl: req.file
        ? `/uploads/${req.file.filename}`
        : null,

      fileName: req.file
        ? req.file.originalname
        : null,

      type: req.file
        ? req.file.mimetype.startsWith("image/")
          ? "image"
          : "file"
        : "text",
    });

    res.json(message);
  }
);

router.get("/getMessages/:conversationId", async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  }).populate("senderId", "username email"); // gets sender details

  res.json(messages);
});

//--------------------------------

module.exports = router;
