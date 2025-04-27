const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;