const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

// Setup Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

console.log('✅ OPENAI_API_KEY loaded:', !!process.env.OPENAI_API_KEY);

// OpenAI setup using Replit Secret
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Root route for browser visits
app.get("/", (req, res) => {
    res.json({ 
        message: "AI Backend is running!", 
        endpoints: {
            chat: "POST /chat - Send a message to the AI tutor"
        }
    });
});
// Temporary route to test OpenAI API key
app.get('/test-openai', async (req, res) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello!' }],
    });
    res.send(response.data.choices[0].message.content);
  } catch (err) {
    console.error('❌ /test-openai failed:', err.response?.data || err.message);
    res.status(500).send('OpenAI connection failed');
  }
});

// AI Chat Route
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "No message received." });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        const reply = completion.choices[0].message.content.trim();
        res.json({ reply });
    } catch (err) {
        console.error("🔴 OpenAI API Error:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        } else {
            console.error("Message:", err.message);
        }
        res.status(500).json({ reply: "Sorry, I couldn't respond right now." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});