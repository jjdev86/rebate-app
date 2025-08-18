const { body } = require('express-validator');

const createApplicationValidation = [
  body('customerFirstName').trim().notEmpty().withMessage('First name is required'),
  body('customerLastName').trim().notEmpty().withMessage('Last name is required'),
  body('installAddress').trim().notEmpty().withMessage('Install address is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phoneNumber').optional().isString(),
  body('productId').isUUID().withMessage('Valid productId (UUID) is required'),
  body('notes').optional().isString(),
];

module.exports = {
  createApplicationValidation
};