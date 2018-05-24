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
    db.ImagesBox.findAll().then(article => {
      res.render('admin/index', {
        article,
        href:'/admin/imagesbox/add',
        obj: "image box",
        edit: "",
        delete: "/admin/delete/"
      })
    })
  })

  router.get('/add', (req, res) => {
    db.ImagesBox.findAll().then(element => {
      let valueNotSlice = Object.keys(element[0].dataValues)
      let value = valueNotSlice.slice(1, -2);
      console.log(value)
      res.render('admin/add', {
        value,
        href: "/admin/imagesbox/add"
      })
    })
  });

  router.post('/add', upload, (req, res) => {
    db.ImagesBox
      .create({
        title: req.body.title,
        theme: req.body.subtitle,
        image: req.file.fieldname,
      })
      .then(task => {
        res.redirect('/admin/imagesbox');
      })
      .catch(err => {
        console.log(err);
      })
  });

  router.post('/delete/:id', (req, res) => {
    db.ImagesBox.destroy({
      where: {
        id: req.params.id
      }
    });
    res.redirect('/admin/imagesbox');
  });


module.exports = router;