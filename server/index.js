const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  // Process the uploaded file here
  // You can access the file details using `file.originalname`, `file.path`, etc.

  res.send("File uploaded successfully.");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});