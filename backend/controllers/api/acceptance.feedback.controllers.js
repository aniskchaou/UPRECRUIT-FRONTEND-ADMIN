
const { findAllAcceptanceFeedBacks, createAcceptanceFeedBack, findAcceptanceFeedBackById, deleteAcceptanceFeedBackById, updateAcceptanceFeedBack, deleteAllAcceptanceFeedBacks } = require("../../services/acceptance.feedback.services");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a AcceptanceFeedBack
    const acceptanceFeedBack = {
        name: req.body.name,
        description: req.body.description
    }
    createAcceptanceFeedBack(acceptanceFeedBack, res)
};

exports.findAll = (req, res) => {
    const AcceptanceFeedBackname = req.query.AcceptanceFeedBackname;
    var condition = AcceptanceFeedBackname ? { AcceptanceFeedBackname: { [Op.like]: `%${AcceptanceFeedBackname}%` } } : null;
    findAllAcceptanceFeedBacks(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findAcceptanceFeedBackById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateAcceptanceFeedBack(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteAcceptanceFeedBackById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllAcceptanceFeedBacks(res)
};