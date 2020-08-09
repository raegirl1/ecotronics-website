const mongoose = require("mongoose");
const fs = require('fs'); // file system
const express = require('express'); // router
const multer = require('multer'); // uploading files

const FormSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  image: { data: Buffer, contentType: String }, // buffer allows us to store image as data in the form of arrays
  ratings: { type: [Number], default: [] },
  comments: { type: [String], default: [] }
});

const Form = mongoose.model('Forms', FormSchema);

module.exports = Form;
