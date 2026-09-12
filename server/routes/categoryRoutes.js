const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Category REST API Routes
 */

router.get('/', getCategories);
router.post('/', authenticateUser, authorizeRole('admin'), createCategory);
router.put('/:id', authenticateUser, authorizeRole('admin'), updateCategory);
router.delete('/:id', authenticateUser, authorizeRole('admin'), deleteCategory);

module.exports = router;
