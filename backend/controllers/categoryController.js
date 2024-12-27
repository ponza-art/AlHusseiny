const Category = require('../models/Category');
const { validateCategory } = require('../utils/validators');

exports.createCategory = async (req, res, next) => {
    try {
        const { error } = validateCategory(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const category = new Category(req.body);
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find()
            .populate('parent', 'name');
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parent');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
}; 