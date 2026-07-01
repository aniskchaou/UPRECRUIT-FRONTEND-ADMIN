const AcceptanceFeedBack = require("../models/acceptance.feedback.models");


exports.findAllAcceptanceFeedBacks = (res) => {

    AcceptanceFeedBack.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving AcceptanceFeedBacks."
            });
        });
}

exports.createAcceptanceFeedBack = (acceptanceFeedBack,res) => {
    // Save AcceptanceFeedBack in the database
    AcceptanceFeedBack.create(acceptanceFeedBack)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the AcceptanceFeedBack."
            });
        });
}

exports.findAcceptanceFeedBackById = (id, res) => {
    AcceptanceFeedBack.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving AcceptanceFeedBack with id=" + id
            });
        });
}

exports.deleteAcceptanceFeedBackById = (id, res) => {
    AcceptanceFeedBack.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "AcceptanceFeedBack was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete AcceptanceFeedBack with id=${id}. Maybe AcceptanceFeedBack was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete AcceptanceFeedBack with id=" + id
            });
        });
}

exports.updateAcceptanceFeedBack = (id, req, res) => {
    AcceptanceFeedBack.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "AcceptanceFeedBack was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update AcceptanceFeedBack with id=${id}. Maybe AcceptanceFeedBack was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating AcceptanceFeedBack with id=" + id
            });
        });
}

exports.deleteAllAcceptanceFeedBacks = (res) => {
    AcceptanceFeedBack.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} AcceptanceFeedBack were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}