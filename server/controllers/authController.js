const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');
require('dotenv').config();

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({ email, password: hashedPassword });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'email', 'createdAt'] });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
exports.updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
// This file contains the authentication controller for user registration, login, fetching user details, updating password, and deleting account.
// It uses bcrypt for password hashing and JWT for token generation, along with express-validator for input validation.
// The controller handles errors and sends appropriate responses based on the success or failure of each operation.
// It also includes methods for updating the user's password and deleting the user's account, ensuring proper validation and error handling throughout the process.
// The `getMe` method retrieves the authenticated user's details, while `updatePassword` and `deleteAccount` methods allow users to manage their account settings securely.
// The controller is designed to be modular and reusable, making it easy to integrate into the overall application architecture.
// The methods are structured to handle asynchronous operations using async/await syntax, providing a clean and readable flow for handling requests and responses.
// Each method includes error handling to catch and log any issues that may arise during execution, ensuring that the application can gracefully handle unexpected situations.
// The use of environment variables for sensitive information like JWT secret and database connection details enhances security and flexibility, allowing for easy configuration across different environments (development, production, etc.).
// Overall, this controller serves as a foundational component for managing user authentication and account management in the application, providing essential functionality for user interactions and security.
// It is designed to be easily extendable, allowing for future enhancements such as additional user features or integrations with other services.
// The controller can be further improved by adding features like email verification, password reset functionality, and multi-factor authentication to enhance security and user experience.
// Additionally, implementing rate limiting and logging for authentication requests can help protect against brute force attacks and monitor user activity.
// The controller can also be integrated with a frontend application to provide a seamless user experience, allowing users to register, log in, and manage their accounts through a user-friendly interface.
// Overall, this authentication controller provides a solid foundation for user management in the application, ensuring secure and efficient handling of user