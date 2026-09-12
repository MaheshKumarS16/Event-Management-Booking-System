const Category = require('../models/Category');

/**
 * Category Controller
 * 
 * Concept Explanation:
 * - What it is: Controller handling event category CRUD operations.
 * - Why we need it: Allows public clients to fetch active categories and Admins to manage categories.
 * - Where we use it: Connected to categoryRoutes.js.
 */

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Admin Only)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists.'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      icon: icon || '📅'
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin Only)
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon, status } = req.body;
    
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    category.name = name ? name.trim() : category.name;
    category.description = description !== undefined ? description : category.description;
    category.icon = icon || category.icon;
    category.status = status || category.status;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin Only)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
