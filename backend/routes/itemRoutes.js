const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// CRUD operations
router.post('/items', itemController.createItem);
router.get('/items', itemController.getItems);
router.get('/items/:id', itemController.getItem);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);

// Search routes
router.get('/search', itemController.searchItems);
router.get('/advanced-search', itemController.advancedSearch);

// Audit log route
router.get('/items/:id/audit', itemController.getItemAuditLog);

module.exports = router;