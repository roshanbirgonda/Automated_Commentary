const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

// Set up multer for file upload
const upload = multer();  // This will store the file in memory by default

const app = express();
const port = 5000;

// Route to send file to Flask for video check
app.post('/predict', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create a new FormData object to send the file
        const form = new FormData();
        form.append('file', req.file.buffer, req.file.originalname);

        // Send the file to Flask backend for checking
        const response = await axios.post('http://127.0.0.1:5001/check-file', form, {
            headers: {
                ...form.getHeaders(),
            }
        });

        // Send Flask's response back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with Flask:', error);
        res.status(500).json({ error: 'Error communicating with Flask server' });
    }
});

app.listen(port, () => {
    console.log(`Express app running at http://localhost:${port}`);
});
