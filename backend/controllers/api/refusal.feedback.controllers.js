
const { findAllRefusalFeedBacks, createRefusalFeedBack, findRefusalFeedBackById, deleteRefusalFeedBackById, updateRefusalFeedBack, deleteAllRefusalFeedBacks } = require("../../services/refusal.feedback.services");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a RefusalFeedBack
    const RefusalFeedBack = {
        name: req.body.name,
        discription: req.body.discription
    }
    createRefusalFeedBack(RefusalFeedBack, res)
};

exports.findAll = (req, res) => {
    const RefusalFeedBackname = req.query.RefusalFeedBackname;
    var condition = RefusalFeedBackname ? { RefusalFeedBackname: { [Op.like]: `%${RefusalFeedBackname}%` } } : null;
    findAllRefusalFeedBacks(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findRefusalFeedBackById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateRefusalFeedBack(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteRefusalFeedBackById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllRefusalFeedBacks(res)
};