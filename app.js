var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

let port     = process.env.PORT || 8000;

var index = require('./routes/index');
var admin = require('./routes/admin');
const db = require(`${__dirname}/models/index.js`)

var app = express();

var nunjucks = require('nunjucks')

app.use(express.static(path.join(__dirname, 'views')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('uploads'));
//app.use(express.static(path.join(__dirname, 'public')));

// Cookie parser - Body parser
app.use(cookieParser())
app.use(bodyParser())
app.set('views', __dirname+'/views/');

app.set('view engine', 'html');
// For nunjucks
nunjucks.configure('views', {
  express: app,
  autoescape: true
});
app.use('/uploads', express.static(__dirname + '/uploads'));
////////////////////////////////////////////////////////////////////////
// MySQL
var sequelize = require('./config/database');

// Test connection to MySQL
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
///////////////////////////////////////////////////////////////////////////


//Storage Multer
///////////////////////////////////////////////////////////////////////////

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname+'.jpg');
  }
});
var upload = multer({ storage : storage }).single('image');

///////////////////////////////////////////////////////////////////////////


// Routing
///////////////////////////////////////////////////////////////////////////
app.use('/', index);
//app.use('/admin', admin);


// Route admin -> GET
app.get('/admin/index', (req, res) => {
  db.Article.findAll().then(article => {
    res.render('admin/index', {article})
})
})

// Route add admin -> POST
app.post('/admin/add',upload, (req, res) => {
  db.Article
    .create({
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.file.fieldname,
        text: req.body.text,
        signature: req.body.signature,
        logo: req.file.logo,
    })
    .then(task => {
      res.redirect('/admin/index');
    })
    .catch(err => {
        console.log(err);
    })
})

// Route add admin -> GET
app.get('/admin/add', (req,res) => {
  res.render('admin/add');
})

// Route update admin -> POST
app.post('/admin/edit/:id', (req,res) => {
  
  db.Article.update(
    { title: req.body.title,
      subtitle: req.body.subtitle,
      image: req.body.image,
      text: req.body.text,
      signature: req.body.signature,
      logo: req.body.logo },
    { where: { id: req.params.id } }
  )
})
// Route update admin -> GET
app.get('/admin/edit/:id', (req,res) => {
  db.Article.findOne({where: {id: req.params.id}})
  .then(article => {
    res.render('admin/edit', {
      title: article.title,
      subtitle: article.subtitle,
      image: article.image,
      text: article.text,
      signature: article.signature,
      signature: article.signature,
      logo: article.logo
    });
  })

})

// Route delete admin
app.post('/admin/delete/:id', (req, res) => {
  db.Article.destroy({
    where: {
        id: req.params.id
    }
  })
  res.redirect('/admin/index');
})
app.get('/admin/delete/:id', (req, res) => {
  res.render('admin/delete', {id: req.params.id})
})


// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
/////////////////////////////////////////////////////////////////////////////

//app.listen(port)

// console.log('Server listening on '+ port)

module.exports = app


