const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

const Contact = require("../models/contact");
const User = require("../models/user");

exports.getContacts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 5;
    let totalItems;
    const count = await Contact.find().countDocuments();

    totalItems = count;
    const contacts = await Contact.find();
   
    res.status(200).json({
      message: "Fetched Contacts successfulllllly.",
      contacts: contacts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createContact = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
 
  const name = req.body.name;
  const surname = req.body.surname;
  const phone = req.body.phone;
  let creator;
  const contact = new Contact({
    name: name,
    surname: surname,
    phone: phone,
    creator: req.userId,
  });
  return contact
    .save()  
    .then((result) => {
      res.status(201).json({
        message: "Contact created successfully!",
        contact: contact,
        creator: { _id: req.userId },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getContact= (req, res, next) => {
  const contactId = req.params.contactId;
  Contact.findById(contactId)
    .then((contact) => {
      if (!contact) {
        const error = new Error("Could not find contact.");
        error.statusCode = 405;
        throw error;
      }
      res.status(200).json({ message: "Contact fetched.", contact: contact });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateContact = (req, res, next) => {
  const contactId = req.params.contactId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;
  let surname = req.body.surname;
  let phone = req.body.phone;
  let creator;
 
  

  Contact.findById(contactId)
    .then((contact) => {
      if (!contact) {
        const err = new Error("Contact Not Found!");
        err.statusCode = 404;
        throw err;
      }

      if (contact.creator.toString() !== req.userId) {
        const err = new Error("Not Authorized!");
        err.statusCode = 403;
        throw err;
      }
    

      contact.name = name;
      contact.surname = surname;
      contact.phone = phone;

      return contact.save();
    })
    .then((result) => {
      res.status(200).json({ message: "contact updated", contact: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

/* exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;    
      post.content = content;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}; */

exports.deleteContact = (req, res, next) => {
  const contactId = req.params.contactId;
  Contact.findById(contactId)
    .then((contact) => {
      //check user
      if (!contact) {
        const error = new Error("Could not find contact.");
        error.statusCode = 404;
        throw error;
      }
      if (contact.creator.toString() !== req.userId) {
        const err = new Error("Not Authorized!");
        err.statusCode = 403;
        throw err;
      }
    
      return Contact.findByIdAndRemove(contactId);
    })   
    .then((result) => {
      res.status(200).json({ message: "Contact Deleted" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

