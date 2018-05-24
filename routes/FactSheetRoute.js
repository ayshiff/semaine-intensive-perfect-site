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
  db.Factsheet.findAll().then(article => {
    res.render('admin/index', {
      article,
      href: '/admin/factsheets/add',
      obj: 'Fact Sheets',
      edit: '/admin/factsheets/edit/',
      delete: '/admin/factsheets/delete/'
    });
  });
});

router.get('/add', (req, res) => {
  db.Factsheet.findAll().then(element => {
    let valueNotSlice = Object.keys(element[0].dataValues);
    let value = valueNotSlice.slice(1, -2);
    if (!value)
      value = ['title', 'adress', 'note', 'price', 'description', 'image'];
    res.render('admin/add', {
      value,
      href: '/admin/factsheets/add'
    });
  });
});

router.post('/add', upload, (req, res) => {
  db.Factsheet.create({
    title: req.body.title,
    adress: req.body.adress,
    note: req.body.note,
    price: req.body.price,
    description: req.body.description,
    image: req.file.filename
  })
    .then(task => {
      res.redirect('/admin/factsheets');
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/delete/:id', (req, res) => {
  res.render('admin/delete', {
    id: req.params.id,
    delete: '/admin/factsheets/delete/'
  });
});

router.post('/delete/:id', (req, res) => {
  db.Factsheet.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect('/admin/factsheets');
});

router.get('/edit/:id', (req, res) => {
  db.Factsheet.findOne({
    where: {
      id: req.params.id
    }
  }).then(article => {
    res.render('admin/edit', {
      tab: [
        article.title,
        article.adress,
        article.note,
        article.price,
        article.description
      ],
      tabKey: ['title', 'adress', 'note', 'price', 'description'],
      lenght: 6,
      update: '/admin/factsheets/edit/',
      id: article.id
    });
  });
});

// Route update admin -> POST
router.post('/edit/:id', upload, (req, res) => {
  db.Factsheet.update(
    {
      title: req.body.title,
      adress: req.body.adress,
      note: req.body.note,
      price: req.body.price,
      description: req.body.description,
      // image: req.file.filename
    },
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/factsheets');
});

module.exports = router;
