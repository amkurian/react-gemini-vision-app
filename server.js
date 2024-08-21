const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
const fs = require('fs')
const multer = require('multer')
const { GoogleGenerativeAI } = require('@google/generative-ai')

new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public'); // Note: Ensure that the 'public' directory exists
  },
  filename: function (req, file, cb) {
    // Get the current date in YYYYMMDD format
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    // Create the new filename with date and original file extension
    const newFilename = `${currentDate}-${file.originalname}`;

    cb(null, newFilename);
  }
});

const upload = multer({ storage: storage }).single('file');
let filePath;

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json(err); // Corrected this line
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' }); // Handle case where no file is uploaded
    }

    filePath = req.file.path;
    return res.status(200).json({ filePath }); // Ensure response is always sent
  });
});


app.listen(PORT, () => console.log("Listening to changes on port " + PORT))