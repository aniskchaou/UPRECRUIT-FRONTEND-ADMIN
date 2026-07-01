
const { findInitialQualification, findFirstInterview, findSecondInterview, findContractProposal, findContractSigned, findAllApplys, createApply, findApplyById, deleteApplyById, updateApply, deleteAllApplys } = require("../../services/apply.services");


exports.findInitialQualification = (req, res) => {
    findInitialQualification(res)
}
exports.findFirstInterview = (req, res) => {
    findFirstInterview(res)
}
exports.findSecondInterview = (req, res) => {
    findSecondInterview(res)
}
exports.findContractProposal = (req, res) => {
    findContractProposal(res)
}
exports.findContractSigned = (req, res) => {
    findContractSigned(res)
}


exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Apply

    const Apply = {
        condidate: req.body.candidate,
        jobOffer: req.body.jobOffer,
        dateApplication: req.body.dateApplication,
        status: req.body.status,
        appreciation: req.body.appreciation,
    }
    createApply(Apply, res)
};

exports.findAll = (req, res) => {
    const Applyname = req.query.Applyname;
    var condition = Applyname ? { Applyname: { [Op.like]: `%${Applyname}%` } } : null;
    findAllApplys(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findApplyById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateApply(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteApplyById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllApplys(res)
};