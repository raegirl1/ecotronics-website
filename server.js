// dependencies
require("dotenv").config();
require("./api/db-conn");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

// routes 
const formRouter = require('./api/routes/form-routes');
const userRouter = require('./api/routes/user-routes');

// models
app.use("/api/form/", formRouter);
app.use("/api/user/", userRouter);

// ensuring other webpages cannot use our api
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

// upload the photo on server side
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


// general routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "hi!" });
});

app.get('/about.html', (req, res) => {
  res.sendFile("about.html", { root: __dirname });
});

app.get('/ithelp.html', (req, res) => {
  res.sendFile("ithelp.html", { root: __dirname });
});

app.get('/faqpage.html', (req, res) => {
  res.sendFile("faqpage.html", { root: __dirname });
});

app.get('/addproject.html', (req, res) => {
  res.sendFile("addproject.html", { root: __dirname });
});

app.get('/ideas.html', (req, res) => {
  res.sendFile("ideas.html", { root: __dirname });
});

app.get('/mapspage.html', (req, res) => {
  res.sendFile("mapspage.html", { root: __dirname });
});

app.get('/findprojects.html', (req, res) => {
  res.sendFile("findprojects.html", { root: __dirname });
});

app.get('/contact.html', (req, res) => {
  res.sendFile("contact.html", { root: __dirname });
});

// port 
const { PORT } = process.env;
app.listen(PORT, () => console.log("Running server on port " + PORT));