const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authMiddleware = require('../middleware/authMiddleware');
const { notificationValidation } = require('../utils/validators');

router.use(authMiddleware);

router.get('/', notificationsController.getAllNotifications);
router.get('/:id', notificationsController.getNotification);
router.post('/', notificationValidation, notificationsController.createNotification);
router.put('/:id', notificationValidation, notificationsController.updateNotification);
router.delete('/:id', notificationsController.deleteNotification);

module.exports = router;
// This file defines the routes for managing notifications, including fetching all notifications, getting a specific notification by ID,
// creating a new notification, updating an existing notification, and deleting a notification.
// It uses a middleware to ensure that the user is authenticated before accessing these routes, and applies validation rules to the notification creation and update requests.
// The controller methods handle the actual logic for each operation, interacting with the database and returning appropriate responses.
// The `notificationValidation` ensures that the required fields are present and valid before processing the request.
// This structure helps maintain a clean separation of concerns, with routes handling the HTTP requests and controllers managing the business logic.
// The use of async/await syntax in the controller methods allows for cleaner asynchronous code, making it easier to read and maintain.
// The router is modular, allowing it to be easily integrated into the main application routing setup.
// This approach enhances code organization and reusability, making it straightforward to manage notification-related operations in the application.
// The routes are designed to be intuitive and RESTful, following standard conventions for resource management.
// Each route corresponds to a specific action on notifications, making it easy for developers to understand and use the API.
// The controller methods are structured to handle asynchronous operations, ensuring that the application can efficiently manage multiple requests without blocking the event