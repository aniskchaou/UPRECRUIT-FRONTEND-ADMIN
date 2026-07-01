
const { findAllRenewContracts, createRenewContract, findRenewContractById, deleteRenewContractById, updateRenewContract, deleteAllRenewContracts } = require("../../services/renew.contract.services");

exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user
    const user = {
        username: req.body.username,
        birthday: req.body.birthday
    }
    createRenewContract(user)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllRenewContracts(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findRenewContractById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateRenewContract(id, req)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteRenewContractById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllRenewContracts(res)
};