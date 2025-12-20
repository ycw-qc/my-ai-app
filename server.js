require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // [1] IMPORT PATH MODULE
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// [2] SERVE STATIC FILES
// This line allows the server to send index.html and any other files (css, js)
// located in the same directory.
app.use(express.static(__dirname));

// [3] UPDATED HOME ROUTE
// When someone opens the home page, send them the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Connect to Google
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

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

// [4] DYNAMIC PORT FOR RENDER
// Render assigns a specific port, so we must use process.env.PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

