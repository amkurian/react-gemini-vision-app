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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public'); // Note: Ensure that the 'public' directory exists
  },
  filename: function (req, file, cb) {
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    const newFilename = `${currentDate}-${uniqueSuffix}-${file.originalname}`;

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


app.post('/gemini', async (req, res) => {
  try{
    function fileToGenerativePart(path, mimeType){
      return{
        inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),
          mimeType
        }
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = req.body.message
    const result = await model.generateContent([prompt, fileToGenerativePart(filePath,"image/jpeg")])
    const response = await result.response
    const text = response.text()
    res.send(text)
  } catch(err){
    console.log(err)
  }
});


app.listen(PORT, () => console.log("Listening to changes on port " + PORT))