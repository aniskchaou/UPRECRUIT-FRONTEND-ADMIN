
const { findAllTasks, createTask, findTaskById, deleteTaskById, updateTask, deleteAllTasks } = require("../../services/task.services");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user
    const user = {
        task: req.body.task,
        status: req.body.status
    }
    createTask(user, res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllTasks(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findTaskById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateTask(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteTaskById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllTasks(res)
};