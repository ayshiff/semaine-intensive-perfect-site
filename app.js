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
//app.use(express.static(path.join(__dirname, 'public')));

// Cookie parser - Body parser
app.use(cookieParser())
app.use(bodyParser())
app.set('views', __dirname+'/views/');
// For nunjucks
nunjucks.configure('views', {
  express: app,
  autoescape: true
});

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
var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, "./img");
  },
  filename: function(req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({
  storage: Storage
}).array("imgUploader", 100);
///////////////////////////////////////////////////////////////////////////


// Routing
///////////////////////////////////////////////////////////////////////////
app.use('/', index);
//app.use('/admin', admin);


// Route admin -> GET
app.get('/admin/index', (req, res) => {
  db.Article.findAll().then(article => {
    res.render('admin/index.html', {article})
})
})

// Route add admin -> POST
app.post('/admin/add', (req, res) => {
  db.Article
    .create({
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.body.image,
        text: req.body.text,
        signature: req.body.signature,
        signature: req.body.signature,
        logo: req.body.logo,
    })
    .then(task => {
        setTimeout(()=> {
           res.redirect('/admin/index'); 
           upload(req, res, function(err) {
            if (err) {
                return res.end("Something went wrong!");
            }
            return res.end("File uploaded sucessfully!.");
        });
        },500)
    })
    .catch(err => {
        console.log(err)
    })
})
// Route add admin -> GET
app.get('/admin/add', (req,res) => {
  res.render('admin/add.html');
})

// Route update admin -> POST
app.post('/admin/edit/:id', (req,res) => {
  db.Article.update(
    { title: req.body.title,
      subtitle: req.body.subtitle,
      image: req.body.image,
      text: req.body.text,
      signature: req.body.signature,
      signature: req.body.signature,
      logo: req.body.logo },
    { where: { id: req.params.id } }
  )
})
// Route update admin -> GET
app.get('/admin/edit/:id', (req,res) => {
  res.render('admin/edit.html', {id: req.params.id});
})

// Route delete admin
app.post('/admin/delete/:id', (req, res) => {
  db.Article.destroy({
    where: {
        id: req.params.id
    }
})
})
app.get('/admin/delete/:id', (req, res) => {
  res.render('admin/delete.html', {id: req.params.id})
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/////////////////////////////////////////////////////////////////////////////

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port)

console.log('Server listening on '+ port)


