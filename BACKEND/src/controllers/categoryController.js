const Category = require('../models/categoryModel');

// Create a new category (C)
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const category = await Category.create({ name, description });
        res.status(201).json({
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

// Get all categories (R)
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// Get a single category by ID (R)
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

// Update a category (U)
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

// Delete a category (D)
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if category is used by any blogs
        const blogCount = await Blog.countDocuments({ category: req.params.id });
        if (blogCount > 0) {
            return res.status(400).json({ message: 'Cannot delete category with associated blogs' });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};