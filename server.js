const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// OpenAI config
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo', // or 'gpt-4' if your key has access
            messages: [
                { role: 'system', content: 'You are an educational tutor for Class 10 students. Answer clearly and simply.' },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 200,
            temperature: 0.7,
        });

        const aiMessage = response.data.choices[0].message.content.trim();
        res.json({ reply: aiMessage });

    } catch (error) {
        console.error('OpenAI Error:', error.response?.data || error.message);
        res.status(500).json({ reply: "Sorry, I couldn't answer that right now." });
    }
});

app.listen(port, () => {
    console.log(`EduLearn AI backend running on http://localhost:${port}`);
});
