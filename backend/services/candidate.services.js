const config = require("../config/connection.server");
const Candidate = require("../models/candidate.models");
const { Op } = require('sequelize');


exports.findAllCandidates = (res) => {

    Candidate.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Candidates."
            });
        });
}

exports.createCandidate = (candidate, res) => {
    // Save Candidate in the database
    Candidate.create(candidate)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Candidate."
            });
        });
}

exports.findCandidateById = (id, res) => {
    Candidate.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Candidate with id=" + id
            });
        });
}

exports.deleteCandidateById = (id, res) => {
    Candidate.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Candidate was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Candidate with id=${id}. Maybe Candidate was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Candidate with id=" + id
            });
        });
}

exports.updateCandidate = (id, req, res) => {
    Candidate.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Candidate was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Candidate with id=${id}. Maybe Candidate was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Candidate with id=" + id
            });
        });
}

exports.deleteAllCandidates = (res) => {
    Candidate.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Candidate were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}

const normalizePlan = (plan) => {
    const lowered = String(plan || '').toLowerCase();
    if (lowered === 'pro' || lowered === 'premium') {
        return 'pro';
    }
    return 'free';
};

const mapTalentCandidate = (candidate, plan) => {
    const fullName = [candidate.firstName, candidate.lastName].filter(Boolean).join(' ').trim() || 'Candidate';
    const skills = (candidate.skills || '')
        .split(/[;,]/)
        .map((item) => item.trim())
        .filter(Boolean);

    const basePayload = {
        id: candidate.id,
        fullName: fullName,
        jobRole: candidate.jobRole || '',
        location: [candidate.city, candidate.country].filter(Boolean).join(', '),
        careerLevel: candidate.careerLevel || '',
        experience: candidate.experience || '',
        skills: skills,
    };

    if (plan === 'pro') {
        return {
            ...basePayload,
            email: candidate.email || '',
            phone: candidate.phone || '',
            summary: candidate.summary || candidate.details || '',
            profileLocked: false,
        };
    }

    return {
        ...basePayload,
        summary: candidate.summary
            ? `${String(candidate.summary).slice(0, 110)}${String(candidate.summary).length > 110 ? '...' : ''}`
            : '',
        email: '',
        phone: '',
        profileLocked: true,
    };
};

exports.searchTalentCandidates = (filters, res) => {
    const query = String(filters.q || '').trim();
    const location = String(filters.location || '').trim();
    const skill = String(filters.skill || '').trim();
    const plan = normalizePlan(filters.plan);

    const where = {};
    const likeOp = Op.iLike || Op.like;

    if (query) {
        where[Op.or] = [
            { firstName: { [likeOp]: `%${query}%` } },
            { lastName: { [likeOp]: `%${query}%` } },
            { jobRole: { [likeOp]: `%${query}%` } },
            { skills: { [likeOp]: `%${query}%` } },
            { summary: { [likeOp]: `%${query}%` } },
        ];
    }

    if (location) {
        where[Op.and] = [
            ...(where[Op.and] || []),
            {
                [Op.or]: [
                    { city: { [likeOp]: `%${location}%` } },
                    { country: { [likeOp]: `%${location}%` } },
                ],
            },
        ];
    }

    if (skill) {
        where[Op.and] = [
            ...(where[Op.and] || []),
            { skills: { [likeOp]: `%${skill}%` } },
        ];
    }

    Candidate.findAll({ where: where, order: [['updatedAt', 'DESC']] })
        .then(data => {
            const limit = plan === 'pro' ? 25 : 5;
            const limitedItems = data.slice(0, limit).map((candidate) => mapTalentCandidate(candidate, plan));

            res.send({
                plan: plan,
                limit: limit,
                totalMatches: data.length,
                shown: limitedItems.length,
                items: limitedItems,
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while searching candidates.',
            });
        });
}

exports.loginUser = (email, password, res) => {
    Candidate.findOne({ where: { email: email, password: password } })
        .then(data => {

            config.user = data
            console.log(config.user)
            if (data === null) {
                res.render("elements/login", { viewTitle: 'Jobs' });
            } else {
                res.render("elements/profile", { viewTitle: 'Jobs' });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
}
