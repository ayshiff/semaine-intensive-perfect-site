let express = require('express');
var router = express.Router();
let multer = require('multer');

const db = require(`../models/index.js`);

//Storage Multer
///////////////////////////////////////////////////////////////////////////

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '.jpg');
    }
  });
  let upload = multer({
    storage: storage
  }).single('image');

  router.get('/', (req,res) => {
    db.AirlineCompany.findAll().then(article => {
      res.render('admin/index', {
        article,
        href:'/admin/airlinescompanies/add',
        obj: "airline company",
        edit: "",
        delete: "/admin/delete/"
      })
    })
  })

  router.get('/add', (req, res) => {
    console.log(db.AirlineCompany)
    db.AirlineCompany.findAll().then(element => {
      let valueNotSlice = Object.keys(element[0].dataValues)
      let value = valueNotSlice.slice(1, -2);
      
      console.log(value)
      res.render('admin/add', {
        value,
        href: "/admin/airlinescompaniesadd"
      })
    })
  });

  router.post('/add', upload, (req, res) => {
    db.AirlineCompany
      .create({
        name: req.body.names
      })
      .then(task => {
        res.redirect('/admin/airlinescompanies');
      })
      .catch(err => {
        console.log(err);
      })
  });

  router.post('/delete/:id', (req, res) => {
    db.AirlineCompany.destroy({
      where: {
        id: req.params.id
      }
    });
    res.redirect('/admin/airlinescompanies');
  });


  module.exports = router