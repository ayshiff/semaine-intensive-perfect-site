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
  db.ImagesBox.findAll().then(article => {
    res.render('admin/index', {
      article,
      href: '/admin/imagesbox/add',
      obj: 'image box',
      edit: '/admin/imagesbox/edit/',
      delete: '/admin/imagesbox/delete/'
    });
  });
});

router.get('/add', (req, res) => {
  db.ImagesBox.findAll().then(element => {
    let valueNotSlice = Object.keys(element[0].dataValues);
    let value = valueNotSlice.slice(1, -2);
    if (!value) value = ['title', 'theme', 'image'];
    console.log(value);
    res.render('admin/add', {
      value,
      href: '/admin/imagesbox/add'
    });
  });
});

router.post('/add', upload, (req, res) => {
  db.ImagesBox.create({
    title: req.body.title,
    theme: req.body.subtitle,
    image: req.file.filename
  })
    .then(task => {
      res.redirect('/admin/imagesbox');
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/delete/:id', (req, res) => {
  res.render('admin/delete', {
    id: req.params.id,
    delete: '/admin/imagesbox/delete/'
  });
});

router.post('/delete/:id', (req, res) => {
  db.ImagesBox.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect('/admin/imagesbox');
});

router.get('/edit/:id', (req, res) => {
  db.ImagesBox.findOne({
    where: {
      id: req.params.id
    }
  }).then(article => {
    res.render('admin/edit', {
      tab: [article.title, article.name, article.image],
      tabKey: ['title', 'name', 'image'],
      lenght: 3,
      update: '/admin/imagesbox/edit/',
      id: article.id
    });
  });
});

router.post('/edit/:id', upload, (req, res) => {
  db.ImagesBox.update(
    {
      name: req.body.name,
      title: req.body.title,
      // image: req.file.filename
    },
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/imagesbox');
});

module.exports = router;
