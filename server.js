const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

console.log("✅ OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);

// ✅ /test-openai route to verify connectivity
const axios = require("axios");

app.get("/test-openai", async (req, res) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("❌ API key missing");
    return res.status(500).send("API key not found");
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello" }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );

    res.send(response.data.choices[0].message.content);
  } catch (err) {
    console.error("❌ Raw API test failed:", err.response?.data || err.message);
    res.status(500).send("OpenAI raw connection failed");
  }
});


// Root route
app.get("/", (req, res) => {
    res.json({
        message: "AI Backend is running!",
        endpoints: {
            chat: "POST /chat - Send a message to the AI tutor",
        },
    });
});

// ✅ /chat endpoint
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "No message received." });
    }

    if (!process.env.OPENAI_API_KEY) {
        console.error("🔴 OPENAI_API_KEY is missing in environment variables");
        return res.status(500).json({ reply: "OpenAI API key not found." });
    }

    try {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        const reply = completion.data.choices[0].message.content.trim();
        res.json({ reply });
    } catch (err) {
        console.error(
            "🔴 OpenAI API Error:",
            err.response?.data || err.message,
        );
        res.status(500).json({ reply: "Sorry, I couldn't respond right now." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});