const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPwd) => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPwd,
        status: "active",
        posts: [],
      });
      return user
        .save()
        .then((result) => {
          res.status(201).json({
            message: "User signed up successfully!",
            userId: result._id,
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("No user Found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong Password");
        erroe.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        "somespersecretkey",
        { expiresIn: "1h" }
      );
      res.status(200).json({token:token, userId :loadedUser._id.toString()})
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.setuserstatus = (req, res,next) =>{

  const userId = req.params.userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const status = req.body.status;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new Error("User tob updated Not Found!");
        err.statusCode = 404;
        throw err;
      } 
      user.status = status; 
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Status updated", user: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}

exports.userstatus = (req,res,next) => {

  const userId = req.query.userId;
 
  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        const error = new Error("No user Found");
        error.statusCode = 401;
        throw error;
      }     
      res.status(200).json({status:user.status})
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}
