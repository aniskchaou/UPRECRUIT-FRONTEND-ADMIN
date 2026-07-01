
const {
    findAllCandidates,
    createCandidate,
    findCandidateById,
    deleteCandidateById,
    updateCandidate,
    deleteAllCandidates,
    searchTalentCandidates,
} = require("../../services/candidate.services");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user
    const user = {

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        nationality: req.body.nationality,
        city: req.body.city,
        country: req.body.country,
        categoryJob: req.body.jobCategory,
        address: req.body.address,
        careerLevel: req.body.careerLevel,
        language: req.body.language,
        salary: req.body.salary,
        remoteWork: req.body.remoteWork,
        summary: req.body.summary,
        cv: req.body.cv,
        coverLetter: req.body.coverLetter,
        skills: req.body.skills,

    }
    console.log(user)
    createCandidate(user, res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllCandidates(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findCandidateById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateCandidate(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteCandidateById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllCandidates(res)
};

exports.searchTalent = (req, res) => {
    const filters = {
        q: req.query.q || '',
        location: req.query.location || '',
        skill: req.query.skill || '',
        plan: req.query.plan || 'free',
    };

    searchTalentCandidates(filters, res);
};