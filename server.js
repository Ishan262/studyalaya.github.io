
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai"); // ✅ New import for v4.x
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ New OpenAI usage for v4.x
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful Class 10 tutor.",
                },
                { role: "user", content: userMessage },
            ],
            max_tokens: 200,
        });

        const reply = chatCompletion.choices[0].message.content.trim();
        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Sorry, I couldn't respond right now." });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ AI Backend running at http://0.0.0.0:${port}`);
});
