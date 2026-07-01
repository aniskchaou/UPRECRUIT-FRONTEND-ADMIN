const ContactType = require("../models/contract.type.models");


exports.findAllContactTypes = (res) => {

    ContactType.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving ContactTypes."
            });
        });
}

exports.createContactType = (ContactType, res) => {
    // Save ContactType in the database
    ContactType.create(ContactType, res)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the ContactType."
            });
        });
}

exports.findContactTypeById = (id, res) => {
    ContactType.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving ContactType with id=" + id
            });
        });
}

exports.deleteContactTypeById = (id, res) => {
    ContactType.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ContactType was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete ContactType with id=${id}. Maybe ContactType was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ContactType with id=" + id
            });
        });
}

exports.updateContactType = (id, req, res) => {
    ContactType.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ContactType was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update ContactType with id=${id}. Maybe ContactType was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating ContactType with id=" + id
            });
        });
}

exports.deleteAllContactTypes = (res) => {
    ContactType.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} ContactType were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}