const router = require("express").Router();
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Form, Comment } = require("../models/form");
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
  User.findOne({ username: req.body.username })
    .exec()
    .then(user => {

      // ###### photo upload #######
      // var file = req.body.image;

      // const storage = multer.diskStorage({
      //   destination: (req, file, cb) => {
      //     cb(null, 'uploads');
      //   },
      //   filename: (req, file, cb) => {
      //     console.log(file);
      //     cb(null, Date.now() + path.extname(file.originalname));
      //   }
      // });

      // const fileFilter = (req, file, cb) => {
      //   if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      //     cb(null, true);
      //   } else {
      //     cb(null, false);
      //   }
      // };

      // const upload = multer({ storage: storage, fileFilter: fileFilter });
      // ##############

      const form = new Form({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        date: Date.now()
      });
      // var imagePath = req.body.imagePath;

      // store photo in uploads folder
      // form.image.data = fs.readFileSync(imagePath);
      // form.image.contentType = 'image/png';

      // save in database
      form.save()
        .then(result => {
          console.log("201");
          res.status(201).redirect("https://raegirl1.github.io/ecotronics-website/ideas.html");
          // res.status(201).json({
          //   message: "Form successfully submitted!"
          // });
        })
        .catch(err => {
          console.log("400: " + err);
          res.status(400).json({ error: err });
        });
    })
    .catch(err => {
      res.status(404).json({ error: err });
      console.log("400: " + err);
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
  Comment.deleteMany({ formId: id })
    .exec();
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

// "like" a form
router.route('/like/:id').patch((req, res) => {
  const id = req.params.id;
  Form.findById(id)
    .exec()
    .then(form => {
      var liked = form.likes + 1;
      Form.update({ _id: id }, { $set: { likes: liked } })
        .exec()
        .then(result => {
          res.status(200).json({ message: "Liked!" });
          console.log("200");
        })
        .catch(err => {
          console.log("400: " + err);
          res.status(400).json({
            error: err
          });
        });
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({ error: err });
    });
});

// comment on a form
router.route('/comment/:formId').patch((req, res) => {
  const formId = req.params.formId;
  const username = req.body.username;

  // check if user exists

  const newComment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    formId: formId,
    username: username,
    date: Date.now(),
    text: req.body.text
  });

  newComment.save()
    .then(result => {
      Form.findById(formId)
        .exec()
        .then(form => {
          Form.update({ _id: formId }, { $push: { comments: newComment } })
            .exec()
            .then(form => {

              res.status(200).json({ message: "Commented!" });
              console.log("200");
            })
            .catch(err => {
              res.status(400).json({ error: err });
              console.log("400: " + err);
            });
        })
        .catch(err => {
          console.log("400: " + err);
          res.status(400).json({ error: err });
        });
    })
    .catch(err => {
      res.status(400).json({ error: err });
      console.log("400: " + err);
    });

});

// delete comment
router.route('/comment/delete/:commentId').delete((req, res) => {
  Comment.findByIdAndDelete(req.params.commentId)
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Comment deleted"
      });
      console.log("200");
    })
    .catch(err => {
      res.status(400).json({ error: err });
      console.log("400: " + err);
    })
});

// update comment

module.exports = router;