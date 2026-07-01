const Company = require("../models/company.models");
const multer = require("multer");

exports.findAllCompanys = (res) => {

    Company.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Companys."
            });
        });
}

exports.createCompany = (company, res) => {
    // Save Company in the database

    console.log(company)
    Company.create(company, res)
        .then(data => {



            /* var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, 'views/assets/uploads')
                },
                filename: function (req, file, cb) {
                    console.log(file)
                    cb(null, file.originalname)
                }
            })

            var upload = multer({ storage: storage }).single('logo')



            upload(req, res, function (err) {

                if (err) {

                    // ERROR occurred (here it can be occurred due
                    // to uploading image of size greater than
                    // 1MB or uploading different file type)
                    console.log("errrrroeeeee")
                    res.send(err)
                }
                else {

                }

            }) */













            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Company."
            });
        });
}

exports.findCompanyById = (id, res) => {
    Company.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Company with id=" + id
            });
        });
}

exports.deleteCompanyById = (id, res) => {
    Company.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Company was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Company with id=${id}. Maybe Company was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Company with id=" + id
            });
        });
}

exports.updateCompany = (id, req, res) => {
    Company.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Company was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Company with id=${id}. Maybe Company was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Company with id=" + id
            });
        });
}

exports.deleteAllCompanys = (res) => {
    Company.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Company were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}