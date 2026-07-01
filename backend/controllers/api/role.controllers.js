const { findAllRoles, createRole, findRoleById, updateRole, deleteRoleById } = require("../../services/role.services");

exports.findAll = (req, res) => {
    findAllRoles(res);
};

exports.create = (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({ message: "Role name is required." });
    }
    createRole({ name: req.body.name }, res);
};

exports.findOne = (req, res) => {
    findRoleById(req.params.id, res);
};

exports.update = (req, res) => {
    updateRole(req.params.id, { name: req.body.name }, res);
};

exports.delete = (req, res) => {
    deleteRoleById(req.params.id, res);
};
