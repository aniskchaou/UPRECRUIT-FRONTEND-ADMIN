
const { findAllCategorys, createCategory, findCategoryById, deleteCategoryById, updateCategory, deleteAllCategorys } = require("../../services/category.services");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Category
    const Category = {
        category: req.body.category
    }
    createCategory(Category,res)
};

exports.findAll = (req, res) => {
    const Categoryname = req.query.Categoryname;
    var condition = Categoryname ? { Categoryname: { [Op.like]: `%${Categoryname}%` } } : null;
    findAllCategorys(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findCategoryById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateCategory(id, req,res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteCategoryById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllCategorys(res)
};