const { validationResult } = require('express-validator');
const { Notification } = require('../models');

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { userId: req.user.id } });
    res.json(notifications);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.createNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const notification = await Notification.create({ ...req.body, userId: req.user.id });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.updateNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    await notification.update(req.body);
    res.json(notification);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    await notification.destroy();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).send('Server error');
  }
};
// This file defines the notificationsController which handles CRUD operations for notifications.
// It includes methods to get all notifications, get a specific notification, create a new notification,
// update an existing notification, and delete a notification.
// Each method uses the Notification model to interact with the database and handles errors appropriately.
// It also uses express-validator to validate incoming request data and respond with appropriate error messages if validation fails.
// The controller ensures that only notifications belonging to the authenticated user are accessed or modified, enhancing security and privacy.
// The `createNotification` method allows users to create new notifications, while `updateNotification` and `deleteNotification` methods enable users to manage their notifications.
// The `getAllNotifications` method retrieves all notifications for the authenticated user, and `getNotification` fetches a specific notification by its ID.
// The controller responds with JSON data and appropriate HTTP status codes based on the success or failure of each operation.
// It also includes error handling to catch any issues that arise during database operations, returning a 500 status code for server errors.
// The use of `validationResult` from express-validator ensures that the request data meets the specified validation criteria before proceeding with the database operations.
// This helps maintain data integrity and provides clear feedback to the client when validation fails.
// Overall, this controller provides a robust interface for managing user notifications within the application, ensuring that users can create, read, update, and delete