const Degree = require("../models/degree.models");


exports.findAllDegrees = (res) => {

    Degree.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Degrees."
            });
        });
}

exports.createDegree = (degree, res) => {
    // Save Degree in the database
    Degree.create(degree, res)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Degree."
            });
        });
}

exports.findDegreeById = (id, res) => {
    Degree.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Degree with id=" + id
            });
        });
}

exports.deleteDegreeById = (id, res) => {
    Degree.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Degree was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Degree with id=${id}. Maybe Degree was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Degree with id=" + id
            });
        });
}

exports.updateDegree = (id, req, res) => {
    Degree.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Degree was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Degree with id=${id}. Maybe Degree was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                message: err
            });
        });
}

exports.deleteAllDegrees = (res) => {
    Degree.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Degree were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}