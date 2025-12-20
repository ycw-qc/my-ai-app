require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allows big images

// Connect to Google using the hidden key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// Using 'gemini-1.5-flash' because '2.5' is not fully released yet
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/ask-ai', async (req, res) => {
    try {
        const { prompt, imageBase64 } = req.body;
        let contents = [prompt];

        if (imageBase64) {
            contents.push({
                inlineData: { data: imageBase64, mimeType: "image/jpeg" }
            });
        }

        const result = await model.generateContent(contents);
        res.json({ response: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));

