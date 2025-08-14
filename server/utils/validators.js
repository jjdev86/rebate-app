const { body } = require('express-validator');

const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password min length is 6'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const docValidation = [
  body('title').notEmpty().withMessage('Title is required'),
];

const notificationValidation = [
  body('message').notEmpty().withMessage('Message is required'),
];

module.exports = {
  registerValidation,
  loginValidation,
  docValidation,
  notificationValidation,
};
// This file exports validation rules for user registration, login, document creation, and notification creation using express-validator.
// It ensures that the required fields are present and meet specified criteria, such as email format and password length.