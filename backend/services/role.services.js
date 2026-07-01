const Role = require("../models/role.models");

exports.findAllRoles = (res) => {
    Role.findAll()
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error retrieving roles." });
        });
};

exports.createRole = (payload, res) => {
    Role.create(payload)
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error creating role." });
        });
};

exports.findRoleById = (id, res) => {
    Role.findByPk(id)
        .then(data => {
            if (!data) return res.status(404).send({ message: "Role not found." });
            res.send(data);
        })
        .catch(err => { res.status(500).send({ message: err.message }); });
};

exports.updateRole = (id, payload, res) => {
    Role.update(payload, { where: { id } })
        .then(() => { res.send({ message: "Role updated successfully." }); })
        .catch(err => { res.status(500).send({ message: err.message }); });
};

exports.deleteRoleById = (id, res) => {
    Role.destroy({ where: { id } })
        .then(() => { res.send({ message: "Role deleted successfully." }); })
        .catch(err => { res.status(500).send({ message: err.message }); });
};
