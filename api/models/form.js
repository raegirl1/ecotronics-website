const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  formId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Form' },
  username: { type: String, required: true },
  date: { type: Date, required: true },
  text: { type: String, required: true }
});


const FormSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  image: { data: Buffer, contentType: String }, // buffer allows us to store image as data in the form of arrays
  likes: { type: Number, default: 0 },
  comments: [{ type: CommentSchema, ref: 'Comment' }]
});

const Form = mongoose.model('Forms', FormSchema);
const Comment = mongoose.model('Comments', CommentSchema);
module.exports = { Form, Comment };
