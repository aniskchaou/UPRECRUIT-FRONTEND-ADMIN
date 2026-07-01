const Education = require("../models/education.models");


exports.findAllEducations = (res) => {

    Education.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Educations."
            });
        });
}

exports.createEducation = (education,res) => {
    // Save Education in the database
    Education.create(education)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Education."
            });
        });
}

exports.findEducationById = (id, res) => {
    Education.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Education with id=" + id
            });
        });
}

exports.deleteEducationById = (id, res) => {
    Education.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Education was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Education with id=${id}. Maybe Education was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Education with id=" + id
            });
        });
}

exports.updateEducation = (id, req, res) => {
    Education.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Education was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Education with id=${id}. Maybe Education was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Education with id=" + id
            });
        });
}

exports.deleteAllEducations = (res) => {
    Education.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Education were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}