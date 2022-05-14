const express = require('express');
const { body } = require('express-validator/check');
const isAuth = require('../middleware/is-auth')

const contactController = require('../controllers/contact');

const router = express.Router();

// GET /feed/posts
router.get('/contacts',isAuth,
 contactController.getContacts);

// POST /feed/post
router.post(
  '/contact',isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  contactController.createContact
);

router.get('/contact/:contactId', isAuth, 
contactController.getContact);

router.put(
  '/contact/:contactId',isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  contactController.updateContact
);

router.delete('/contact/:contactId',isAuth,
contactController.deleteContact);

module.exports = router;
