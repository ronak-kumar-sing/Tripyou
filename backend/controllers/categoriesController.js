const { Category, Tour } = require('../models');
const { generateSlug } = require('../utils/helpers');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ is_active: true })
      .sort({ display_order: 1, name: 1 });

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      is_active: true
    }).populate({
      path: 'tours',
      match: { is_active: true },
      select: '-__v'
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create category (admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, type, icon_url, description, display_order } = req.body;

    const slug = generateSlug(name);

    // Check if slug exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'A category with this name already exists' });
    }

    const category = new Category({
      name,
      slug,
      type,
      icon_url,
      description,
      display_order: display_order || 0,
    });
    await category.save();

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update category (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // If name changed, regenerate slug
    if (req.body.name && req.body.name !== category.name) {
      req.body.slug = generateSlug(req.body.name);
    }

    Object.assign(category, req.body);
    await category.save();

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete category (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category has tours
    const tourCount = await Tour.countDocuments({ category_id: req.params.id });
    if (tourCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${tourCount} tours associated with it.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all categories for admin (including inactive)
exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ display_order: 1, name: 1 })
      .populate({
        path: 'tours',
        select: 'id',
        options: { lean: true }
      });

    // Add tour count to each category
    const categoriesWithCount = categories.map(cat => {
      const catData = cat.toObject();
      catData.tour_count = catData.tours ? catData.tours.length : 0;
      delete catData.tours;
      return catData;
    });

    res.json({ success: true, data: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

