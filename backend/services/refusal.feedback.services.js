const RefusalFeedBack = require("../models/refusal.feedback.models");


exports.findAllRefusalFeedBacks = (res) => {

    RefusalFeedBack.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving RefusalFeedBacks."
            });
        });
}

exports.createRefusalFeedBack = (refusalFeedBack,res) => {
    // Save RefusalFeedBack in the database
    RefusalFeedBack.create(refusalFeedBack)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the RefusalFeedBack."
            });
        });
}

exports.findRefusalFeedBackById = (id, res) => {
    RefusalFeedBack.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving RefusalFeedBack with id=" + id
            });
        });
}

exports.deleteRefusalFeedBackById = (id, res) => {
    RefusalFeedBack.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "RefusalFeedBack was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete RefusalFeedBack with id=${id}. Maybe RefusalFeedBack was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete RefusalFeedBack with id=" + id
            });
        });
}

exports.updateRefusalFeedBack = (id, req, res) => {
    RefusalFeedBack.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "RefusalFeedBack was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update RefusalFeedBack with id=${id}. Maybe RefusalFeedBack was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating RefusalFeedBack with id=" + id
            });
        });
}

exports.deleteAllRefusalFeedBacks = (res) => {
    RefusalFeedBack.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} RefusalFeedBack were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}