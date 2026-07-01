const Skill = require("../models/skill.models");


exports.findAllSkills = (res) => {

    Skill.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Skills."
            });
        });
}

exports.createSkill = (skill,res) => {
    // Save Skill in the database
    Skill.create(skill)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Skill."
            });
        });
}

exports.findSkillById = (id, res) => {
    Skill.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Skill with id=" + id
            });
        });
}

exports.deleteSkillById = (id, res) => {
    Skill.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Skill was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Skill with id=${id}. Maybe Skill was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Skill with id=" + id
            });
        });
}

exports.updateSkill = (id, req, res) => {
    Skill.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Skill was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Skill with id=${id}. Maybe Skill was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Skill with id=" + id
            });
        });
}

exports.deleteAllSkills = (res) => {
    Skill.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Skill were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}