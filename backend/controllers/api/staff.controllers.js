
const {  findAllStaffs, createStaff, findStaffById, deleteStaffById, updateStaff, deleteAllStaffs } = require("../../services/staff.services");

exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user
    const user = {
        username: req.body.username,
        birthday: req.body.birthday
    }
    createStaff(user)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllStaffs(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findStaffById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateStaff(id, req)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteStaffById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllStaffs(res)
};