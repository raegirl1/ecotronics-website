const router = require("express").Router();
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Form = require("../models/form");
const User = require("../models/user");

// get all forms
router.route('/').get((req, res) => {
  Form.find()
    .select('-__v')
    .exec()
    .then(forms => {
      const response = {
        count: forms.length,
        forms: forms
      };
      console.log("200");
      res.status(200).json(response);
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({ error: err });
    });
});

// get a specific form
router.route('/:id').get((req, res) => {
  Form.findById(req.params.id)
    .select('-__v')
    .exec()
    .then(form => {
      console.log("200");
      res.status(200).json(form);
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({ error: err });
    });
});


// create a form

router.post('/', (req, res) => {
  // check if user exists
  User.findById(req.body.username)
    .exec()
    .catch(err => {
      res.status(404).json({ error: err })
    });

  // photo upload
  var file = req.body.image;

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


  const form = new Form({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    title: req.body.title,
    description: req.body.description,
    date: Date.now()
  });
  var imagePath = req.body.imagePath;

  // store photo in uploads folder
  // form.image.data = fs.readFileSync(imagePath);
  // form.image.contentType = 'image/png';

  // save in database
  form.save()
    .then(result => {
      console.log("201");
      res.status(201).json({
        message: "Form successfully submitted!"
      });
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({ error: err });
    });
});

// update a form
router.route('/:id').patch((req, res) => {
  const id = req.params.id;
  const props = req.body;
  Form.updateMany({ _id: id }, props)
    .exec()
    .then(form => {
      console.log("200");
      res.status(200).json({
        message: "Form updated!",
      });
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({ error: err });
    });
});

// delete a form
router.route('/:id').delete((req, res) => {
  const id = req.params.id;
  Form.deleteOne({ _id: id }).exec()
    .then(result => {
      console.log("200");
      res.status(200).json({ message: "Form successfully deleted!" });
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({ error: err });
    });
});

module.exports = router;