const Experience = require("../models/experience.models");


exports.findAllExperiences = (res) => {

    Experience.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Experiences."
            });
        });
}

exports.createExperience = (experience,res) => {
    // Save Experience in the database
    Experience.create(experience,res)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Experience."
            });
        });
}

exports.findExperienceById = (id, res) => {
    Experience.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Experience with id=" + id
            });
        });
}

exports.deleteExperienceById = (id, res) => {
    Experience.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Experience was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Experience with id=${id}. Maybe Experience was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Experience with id=" + id
            });
        });
}

exports.updateExperience = (id, req, res) => {
    Experience.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Experience was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Experience with id=${id}. Maybe Experience was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Experience with id=" + id
            });
        });
}

exports.deleteAllExperiences = (res) => {
    Experience.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Experience were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}