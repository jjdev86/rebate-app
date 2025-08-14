const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docsController');
const authMiddleware = require('../middleware/authMiddleware');
const { docValidation } = require('../utils/validators');

router.use(authMiddleware);

router.get('/', docsController.getAllDocs);
router.get('/:id', docsController.getDoc);
router.post('/', docValidation, docsController.createDoc);
router.put('/:id', docValidation, docsController.updateDoc);
router.delete('/:id', docsController.deleteDoc);

module.exports = router;
// This file defines the routes for document management, including fetching all documents, getting a specific document by ID,
// creating a new document, updating an existing document, and deleting a document.
// It uses a middleware to ensure that the user is authenticated before accessing these routes, and applies validation rules to the document creation and update requests.
// The controller methods handle the actual logic for each operation, interacting with the database and returning appropriate responses.
// The `docValidation` ensures that the required fields are present and valid before processing the request.
// This structure helps maintain a clean separation of concerns, with routes handling the HTTP requests and controllers managing the business logic.
// The use of async/await syntax in the controller methods allows for cleaner asynchronous code, making it easier to read and maintain.
// The router is modular, allowing it to be easily integrated into the main application routing setup.
// This approach enhances code organization and reusability, making it straightforward to manage document-related operations in the application.
// The routes are       