const config = require("../config/connection.server");
const { loginUser } = require("../services/candidate.services");
const { createApply } = require("../services/apply.services");
const JobOffer = require("../models/job.offer.models");
const Candidate = require("../models/candidate.models");
const multer = require("multer");
const Company = require("../models/company.models");


exports.getHome = async function (req, res) {
  //res.redirect('/list')
  Company.findAll({
    raw: true,
    //Other parameters
  })
    .then(firms => {


      const jobs = JobOffer.findAll().then(data => {
        res.render("elements/index", {
          viewTitle: 'UP Recruit', jobs: data.map(item => {
            const nameFirm = firms.filter(it => it.id === item.firm)[0]?.name
            const image = firms.filter(it => it.id === item.firm)[0]?.logo
            return { image: image, firm: nameFirm, id: item.id, salaryFrom: item.salaryFrom, salaryTo: item.salaryTo, post: item.post, location: item.location }
          })
        });
      })

    })

}



exports.getLogin = async function (req, res) {
  //res.redirect('/list')
  res.render("elements/login", { viewTitle: 'Login' });
}

exports.getCompanies = async function (req, res) {
  //res.redirect('/list')
  res.render("elements/companies", { viewTitle: 'Companies' });
}


exports.getJobs = async function (req, res) {
  //res.redirect('/list')
  res.render("elements/jobs", { viewTitle: 'Jobs' });
}

exports.getElements = async function (req, res) {
  //res.redirect('/list')
  res.render("elements/elements", { viewTitle: 'Elements' });
}

exports.getOpeningHours = async function (req, res) {
  //res.redirect('/list')
  res.render("elements/openinghours", { viewTitle: 'Opening hours' });
}

exports.getPricing = async function (req, res) {
  //res.redirect('/list')
  res.render("elements/pricing", { viewTitle: 'Pricing' });
}

exports.getServices = async function (req, res) {
  //res.redirect('/list')
  res.render("elements/services", { viewTitle: 'Services' });
}


exports.getRegister = async function (req, res) {
  //res.redirect('/list')
  res.render("elements/register", { viewTitle: 'Register' });
}


exports.getJobDetail = async function (req, res) {
  //res.redirect('/list')
  // res.render("elements/viewjob", { viewTitle: 'Pricing' });
  console.log(req.params.id)
  console.log(config.user.id)
  JobOffer.findByPk(req.params.id)
    .then(data => {

      Company.findAll({
        raw: true,
        //Other parameters
      })
        .then(firms => {
          console.log(data)
          const nameFirm = firms.filter(it => it.id === data.firm)[0]?.name
          const image = firms.filter(it => it.id === data.firm)[0]?.logo
          console.log(image)
          res.render('elements/viewjob', {
            job:



            {
              responsibilities: data.responsibilities, minimumQualifications: data.minimumQualifications,
              preferredQualifications: data.preferredQualifications, description: data.description,
              image: image, firm: nameFirm, id: data.id, salaryFrom: data.salaryFrom,
              salaryTo: data.salaryTo, post: data.post, location: data.location,
              experienceLevel: data.experienceLevel, gender: data.gender, degree: data.degree, start: data.start, requirement: data.requirement
            }



            , title: 'my other page', layout: 'otherLayout', idJob: req.params.id, idUser: config.user.id
          });


        })

    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });

}

exports.getAuth = async function (req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  const user = {
    email: req.body.email,
    password: req.body.password,

  }

  loginUser(user.email, user.password, res)
  //res.render("elements/profile", { viewTitle: 'Profile' });
}

exports.sendCandidature = async function (req, res) {
  c
}

exports.newCandidature = async function (req, res) {
  //res.redirect('/list')
  // console.log(res)
  res.render("elements/send_candidature", { viewTitle: 'UP Recruit', layout: 'otherLayout', idJob: req.params.idJob });
}

exports.adminPanel = (req, res) => {
  res.writeHead(302, {
    'Location': config.url
  });
  res.end();
};

exports.finishCandidature = async function (req, res) {
  //res.redirect('/list')
  //console.log(req.body)
  //res.render("elements/send_candidature", { viewTitle: 'UP Recruit', layout: 'otherLayout' });
  var filename = null
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'views/assets/uploads')
    },
    filename: function (req, file, cb) {
      console.log(file)
      filename = file.originalname
      cb(null, file.originalname)
    }
  })

  var upload = multer({ storage: storage }).single('cv')



  upload(req, res, function (err) {

    if (err) {

      // ERROR occurred (here it can be occurred due
      // to uploading image of size greater than
      // 1MB or uploading different file type)
      console.log("errrrroeeeee")
      res.send(err)
    }
    else {

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
        cv: filename,
        coverLetter: req.body.coverLetter,
        telephone: req.body.telephone
        //skills: req.body.skills,
      }

      Candidate.create(user)
        .then(data => {
          console.log(data.dataValues.id)
          const Apply = {
            condidate: data.dataValues.id,
            jobOffer: req.body.idJob,
            dateApplication: new Date().toISOString(),
            status: 'Pending',
            appreciation: 'Good',
          }
          // console.log(Apply)
          createApply(Apply, res)
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Candidate."
          });
        });


    }
  })






}

