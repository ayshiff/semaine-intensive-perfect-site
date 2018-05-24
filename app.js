let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let multer = require('multer');

let port = process.env.PORT || 8000;

let index = require('./routes/index');
const db = require(`${__dirname}/models/index.js`);

// Routes
let PartnerRoute = require('./routes/PartnerRoute');
let ImageBoxRoute = require('./routes/ImageBoxRoute');
let AirlineCompanyRoute = require('./routes/AirlineCompanyRoute');

let app = express();

let nunjucks = require('nunjucks');

app.use(express.static(path.join(__dirname, 'views')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static('uploads'));
//app.use(express.static(path.join(__dirname, 'public')));

// Cookie parser - Body parser
app.use(cookieParser());
app.use(bodyParser());
app.set('views', __dirname + '/views/');

// Config Helmet
let helmet = require('helmet');
app.use(helmet());

app.set('view engine', 'html');
// For nunjucks
nunjucks.configure('views', {
  express: app
});
app.use('/uploads', express.static(__dirname + '/uploads'));
////////////////////////////////////////////////////////////////////////
// MySQL
let sequelize = require('./config/database');

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

///////////////////////////////////////////////////////////////////////////

// Routing
///////////////////////////////////////////////////////////////////////////
app.use('/', index);
app.use('/admin/partners', PartnerRoute);
app.use('/admin/imagesbox', ImageBoxRoute);
app.use('/admin/airlinescompanies', AirlineCompanyRoute);

app.get('/auth', (req,res) => {
  res.render('auth');
});

////////////////////////////////////////////////////////////////////////////


app.get('/admin/index', (req, res) => {
  db.Article.findAll().then(article => {
    res.render('admin/index', {
      article,
      href:'/admin/add',
      obj: "article",
      edit: "/admin/edit/",
      delete: "/admin/delete/"
    })
  })
});

app.get('/admin/add', (req, res) => {
  sequelize.Project = sequelize.import('./models/partner');
  console.log(sequelize.Project)
  db.Article.findAll().then(element => {
    let valueNotSlice = Object.keys(element[0].dataValues)
    let value = valueNotSlice.slice(1, -2);
    console.log(value)
    res.render('admin/add', {
      value,
      href: "/admin/add"
    })
  })
});

// Route add admin -> POST
app.post('/admin/add', upload, (req, res) => {
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
});

// Route delete admin
app.post('/admin/delete/:id', (req, res) => {
  db.Article.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect('/admin/index');
});

// Route update admin -> GET
app.get('/admin/edit/:id', (req, res) => {

  db.Article.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(article => {
    console.log(article.id)
    res.render('admin/edit', {
      tab :[article.title,
        article.subtitle,
        article.image,
        article.text,
        article.signature,
        article.id,
        article.logo] ,
          tabKey: ["title","subtitle","image","text","signature","logo"],
          lenght: 6,
          update: "/admin/edit/",
        id: article.id
    });
  })
  
  });

// Route update admin -> POST
app.post('/admin/edit/:id', upload, (req, res) => {
 
  db.Article.update(
    { title: req.body.title,
      subtitle: req.body.subtitle,
      //logo: req.file.fieldname,
      //image: req.file.fieldname,
      text: req.body.text,
      signature: req.body.signature},
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/index');
});

app.get('/admin/delete/:id', (req, res) => {
  res.render('admin/delete', {
    id: req.params.id,
    delete: "/admin/delete/"
  })
});

module.exports = app;
