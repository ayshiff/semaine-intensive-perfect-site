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

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.Partner.findAll().then(article => {
    res.render('admin/index', {
      article,
      href: '/admin/partners/add',
      obj: 'partner',
      edit: '/admin/partners/edit/',
      delete: '/admin/partners/delete/'
    });
  });
});

router.get('/add', (req, res) => {
  db.Partner.findAll().then(element => {
    let valueNotSlice = Object.keys(element[0].dataValues);
    let value = valueNotSlice.slice(1, -2);
    if (!value) value = ['title', 'signature', 'image'];
    res.render('admin/add', {
      value,
      href: '/admin/partners/add'
    });
  });
});

router.post('/add', upload, (req, res) => {
  db.Partner.create({
    title: req.body.title,
    signature: req.body.signature,
    image: req.file.filename
  })
    .then(task => {
      res.redirect('/admin/partners');
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/delete/:id', (req, res) => {
  res.render('admin/delete', {
    id: req.params.id,
    delete: '/admin/partners/delete/'
  });
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
  }).then(article => {
    res.render('admin/edit', {
      tab: [article.title, article.image, article.signature, article.id],
      tabKey: ['title', 'image', 'signature'],
      update: '/admin/partners/edit/',
      id: article.id
    });
  });
});

// Route update admin -> POST
router.post('/edit/:id', upload, (req, res) => {
  db.Partner.update(
    {
      title: req.body.title,
      image: req.file.filename,
      signature: req.body.signature
    },
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

router.get('/edit/:id', (req, res) => {
  db.Partner.findOne({
    where: {
      id: req.params.id
    }
  }).then(article => {
    res.render('admin/edit', {
      tab: [article.title, article.signature, article.image],
      tabKey: ['title', 'signature', 'image'],
      lenght: 3,
      update: '/admin/partners/edit/'
    });
  });
});

router.post('/edit/:id', upload, (req, res) => {
  db.Partner.update(
    {
      signature: req.body.signature,
      title: req.body.title,
      image: req.file.filename
    },
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/partners');
});

module.exports = router;
