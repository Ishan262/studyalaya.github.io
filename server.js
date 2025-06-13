const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

console.log("✅ TOGETHER_API_KEY loaded:", !!process.env.TOGETHER_API_KEY);

app.get("/", (req, res) => {
  res.json({
    message: "AI Tutor Backend is running!",
    endpoints: {
      chat: "POST /chat - Ask a study-related question",
    },
  });
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "No message received." });
  }

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: `You are a strict and helpful tutor for class 10 students. Only answer questions related to academic topics like math, science, social science, English, and school-related curriculum. If the user asks anything outside these subjects—such as jokes, personal questions, opinions, or anything inappropriate—reply with: "Sorry, I can only help with class 10 academic subjects."`
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("🔴 Together.ai error:", err.response?.data || err.message);
    res.status(500).json({ reply: "Sorry, the AI assistant could not respond right now." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
