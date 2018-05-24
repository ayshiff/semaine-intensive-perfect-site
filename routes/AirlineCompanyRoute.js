let express = require('express');
var router = express.Router();
let multer = require('multer');

const db = require(`../models/index.js`);

//Storage Multer
///////////////////////////////////////////////////////////////////////////

let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, next) {
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        next(null, file.fieldname + '-' + Date.now() + '.' + ext);
    }
});
let upload = multer({
    storage: storage
}).single('image');

router.get('/', (req, res) => {
  db.AirlineCompany.findAll().then(article => {
    res.render('admin/index', {
      article,
      href: '/admin/airlinescompanies/add',
      obj: 'airline company',
      edit: '/admin/airlinescompanies/edit/',
      delete: '/admin/airlinescompanies/delete/'
    });
  });
});

router.get('/add', (req, res) => {
  console.log(db.AirlineCompany);
  db.AirlineCompany.findAll().then(element => {
    let valueNotSlice = Object.keys(element[0].dataValues);
    let value = valueNotSlice.slice(1, -2);
    if (!value) value = ['name'];
    console.log(value);
    res.render('admin/add', {
      value,
      href: '/admin/airlinescompanies/add'
    });
  });
});

router.post('/add', upload, (req, res) => {
  db.AirlineCompany.create({
    name: req.body.name
  })
    .then(task => {
      res.redirect('/admin/airlinescompanies');
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/delete/:id', (req, res) => {
  res.render('admin/delete', {
    id: req.params.id,
    delete: '/admin/airlinescompanies/delete/'
  });
});

router.post('/delete/:id', (req, res) => {
  db.AirlineCompany.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect('/admin/airlinescompanies');
});

router.get('/edit/:id', (req, res) => {
  db.AirlineCompany.findOne({
    where: {
      id: req.params.id
    }
  }).then(article => {
    res.render('admin/edit', {
      tab: [article.name],
      tabKey: ['name'],
      lenght: 1,
      update: '/admin/airlinescompanies/edit/',
      id: article.id
    });
  });
});

// Route update admin -> POST
router.post('/edit/:id', upload, (req, res) => {
  db.AirlineCompany.update(
    { name: req.body.name },
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/airlinescompanies');
});

module.exports = router;
