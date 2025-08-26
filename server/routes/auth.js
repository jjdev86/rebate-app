const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../utils/validators');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register',registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
// This file defines the authentication routes for user registration, login, and fetching user details.
// It uses express-validator for input validation and a custom middleware for authentication checks.
