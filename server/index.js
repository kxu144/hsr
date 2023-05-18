const express = require("express");
const multer = require("multer");
const cors = require('cors');
const { createWorker } = require('tesseract.js');

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors({
    origin: '*'
}));

app.post("/upload", upload.single("file"), (req, res) => {

  const file = req.file;

  if (!file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  console.log("Uploaded " + file.path);

  // OCR processing using tesseract.js
  (async () => {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(file.path);
    console.log('OCR Result:', text);
    await worker.terminate();

    res.send(text);
  })().catch(error => {
    console.error('Error:', error);
    res.status(500).send('Error during OCR processing.');
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});