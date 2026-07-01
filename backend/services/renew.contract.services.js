const RenewContract = require("../models/renew.contract.models");


exports.findAllRenewContracts = (res) => {

    RenewContract.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving RenewContracts."
            });
        });
}

exports.createRenewContract = (RenewContract) => {
    // Save RenewContract in the database
    RenewContract.create(RenewContract)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the RenewContract."
            });
        });
}

exports.findRenewContractById = (id, res) => {
    RenewContract.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving RenewContract with id=" + id
            });
        });
}

exports.deleteRenewContractById = (id, res) => {
    RenewContract.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "RenewContract was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete RenewContract with id=${id}. Maybe RenewContract was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete RenewContract with id=" + id
            });
        });
}

exports.updateRenewContract = (id, req, res) => {
    RenewContract.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "RenewContract was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update RenewContract with id=${id}. Maybe RenewContract was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating RenewContract with id=" + id
            });
        });
}

exports.deleteAllRenewContracts = (res) => {
    RenewContract.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} RenewContract were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}