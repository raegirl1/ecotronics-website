const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// get all users
router.get('/', (req, res, next) => {
  User.find()
    .select('-__v')
    .exec()
    .then(users => {
      const response = {
        count: users.length,
        users: users
      };
      console.log("200");
      res.status(200).json(response);
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({ error: err });
    });
});

// get a specific user
router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .select('-__v')
    .exec()
    .then(user => {
      console.log("200");
      res.status(200).json(user);
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({ error: err });
    });
});

// sign-up (create a user)
router.post('/signup', (req, res, next) => {
  //check if there is an existing user with the same username
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        console.log("409: User exists");
        return res.status(409).json({
          message: 'User exists'
        });
      } else {
        //encrypting using bcrypt.hash(plain_text, saltRounds)
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log("400: " + err);
            return res.status(400).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              city: req.body.city,
              state: req.body.state
            });
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: 'User ' + req.body.username + ' created'
                });
              })
              .catch(err => {
                console.log("400: " + err);
                res.status(400).json({
                  error: err
                })
              })
          }
        });

      }
    })
});

// update a user
router.route('/update/:id').patch((req, res) => {
  const id = req.params.id;
  const props = req.body;
  User.updateMany({ _id: id }, props)
    .exec()
    .then(user => {
      console.log("200: Success! User updated!");
      res.status(200).json({
        message: "User updated!"
      })
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({
        error: err
      })
    });
});

// delete a user
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  User.remove({ _id: id }).exec()
    .then(result => {
      console.log("200: Success! User deleted!");
      res.status(200).json({ "message": "User deleted!" });
    })
    .catch(err => {
      console.log("400: " + err);
      res.status(400).json({ "error": err });
    })
});
// TODO: log in

module.exports = router;