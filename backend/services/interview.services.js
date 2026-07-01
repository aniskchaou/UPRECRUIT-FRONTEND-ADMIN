const Interview = require("../models/interview.models");


exports.findAllInterviews = (res) => {

    Interview.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Interviews."
            });
        });
}

exports.createInterview = (interview,res) => {
    // Save Interview in the database
    Interview.create(interview,res)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Interview."
            });
        });
}

exports.findInterviewById = (id, res) => {
    Interview.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Interview with id=" + id
            });
        });
}

exports.deleteInterviewById = (id, res) => {
    Interview.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Interview was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Interview with id=${id}. Maybe Interview was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Interview with id=" + id
            });
        });
}

exports.updateInterview = (id, req, res) => {
    Interview.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Interview was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Interview with id=${id}. Maybe Interview was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Interview with id=" + id
            });
        });
}

exports.deleteAllInterviews = (res) => {
    Interview.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Interview were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}