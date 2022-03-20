const express = require("express");
const { body } = require("express-validator/check");
const User = require("../models/user");

const authController = require("../controllers/auth");
const isAuth = require('../middleware/is-auth')

const router = express.Router();
router.put("/signup"
, [
    body("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post('/login'
,authController.login
);

router.put('/setuserstatus/:userId'
,isAuth
,authController.setuserstatus
);

router.get('/userstatus'
,isAuth
, authController.userstatus)
module.exports = router;
