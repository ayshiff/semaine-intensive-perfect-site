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

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.Partner.findAll().then(article => {
        res.render('admin/index', {
          article,
          href:'/admin/partners/add',
          obj: "partner",
          edit: "/admin/partners/edit/",
          delete: "/admin/partners/delete/"
        })
      })
});


router.get('/add', (req, res) => {
    db.Partner.findAll().then(element => {
      let valueNotSlice = Object.keys(element[0].dataValues)
      let value = valueNotSlice.slice(1, -2);
      console.log(value)
      res.render('admin/add', {
        value,
        href: "/admin/partners/add"
      })
    })
  });

router.post('/add', upload, (req, res) => {
    db.Partner
      .create({
        title: req.body.title,
        signature: req.body.signature,
        image: req.file.fieldname,
      })
      .then(task => {
        res.redirect('/admin/partners');
      })
      .catch(err => {
        console.log(err);
      })
  });

router.post('/delete/:id', (req, res) => {
    db.Partner.destroy({
      where: {
        id: req.params.id
      }
    });
    res.redirect('/admin/partners');
  });

router.get('/edit/:id', (req, res) => {

    db.Partner.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(article => {
      
      res.render('admin/edit', {
        tab :[article.title,
        article.image,
        article.signature,
        article.id],
        tabKey: ["title","image","signature"],
        update: "/admin/partners/edit/"
      });
    })
    });
  
  // Route update admin -> POST
  router.post('/edit/:id', upload, (req, res) => {
   
    db.Partner.update(
      { title: req.body.title,
        image: req.file.fieldname,
        signature: req.body.signature},
      { where: { id: req.params.id } }
    );
    res.redirect('/admin/partners');
  // }
  
  });

  router.post('/delete/:id', (req, res) => {
    db.Partner.destroy({
      where: {
        id: req.params.id
      }
    });
    res.redirect('/admin/index');
  });



module.exports = router;
