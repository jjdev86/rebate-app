// middleware/fileValidate.js
const { validationResult } = require('express-validator');

module.exports = function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  // Flatten errors for a compact payload
  const errors = result.array().map(e => ({
    field: e.param,
    message: e.msg,
    value: e.value
  }));

  return res.status(400).json({ errors });
};
