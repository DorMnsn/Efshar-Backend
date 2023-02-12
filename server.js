require("dotenv").config();
const multer = require("multer");
const { s3Uploadv2, s3Uploadv3 } = require("./s3Service");
const uuid = require("uuid").v4;

const express = require("express"); //import express
const app = express(); // initalize express in the app var

const mongoose = require("mongoose");

const routesUrls = require("./routers/routes");

const cors = require("cors");

mongoose.connect(
  "mongodb+srv://dor:dor@cluster0.q8gw4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  () => console.log("Database connected")
);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 2 },
});

app.use(express.json());
app.use(cors());
app.use("/app", routesUrls);
app.listen(4000, () => console.log("server is up and running")); // nodejs app run on port 4000
