let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let multer = require('multer');

let port = process.env.PORT || 8000;

let sassMiddleware = require('node-sass-middleware');

let index = require('./routes/index');
const db = require(`${__dirname}/models/index.js`);

// Routes
let PartnerRoute = require('./routes/PartnerRoute');
let ImageBoxRoute = require('./routes/ImageBoxRoute');
let AirlineCompanyRoute = require('./routes/AirlineCompanyRoute');
let FactSheetRoute = require('./routes/FactSheetRoute');

let app = express();

app.use('/src', express.static(path.join(__dirname, 'src')));

let nunjucks = require('nunjucks');

app.use(express.static(path.join(__dirname, 'views')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
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



// Routing

// app.use('/index', index);

// Routes backoffice
app.use('/admin/partners', PartnerRoute);
app.use('/admin/imagesbox', ImageBoxRoute);
app.use('/admin/airlinescompanies', AirlineCompanyRoute);
app.use('/admin/factsheets', FactSheetRoute);

app.get('/auth', (req, res) => {
  res.render('auth');
});



// Routes front


app.get('/top100', (req, res) => {
    res.render('front/top100');
});

app.get('/auth', (req,res) => {
  res.render('auth');
})

app.post('/auth', (req,res) => {
  res.redirect('/admin/index');
})

app.get('/index', (req, res) => {
  db.ImagesBox.findAll().then(article => {
    console.log(article[0].dataValues.image);
    res.render('front/index', {
      article,
      current: 'index'
    });
  });
});

app.get('/contact', (req, res) => {
  res.render('front/contact', {
    current: 'contact'
  });
});

app.get('/magazine', (req, res) => {
  res.render('front/magazine', {
    current: 'magazine'
  });
});

app.get('/categories', (req, res) => {
  db.Factsheet.findAll().then(article => {
    let strNote = ['', '', '', '', '', '', ''];
    for (let a = 0; a < article.length; a++) {
      for (let i = 1; i < article[a].dataValues.note + 1; i++) {
        strNote[a] += '€';
      }
    }

    res.render('front/categories', {
      article,
      strNote,
      current: 'categories'
    });
  });
});

app.get('/actualites', (req, res) => {
  db.Article.findAll().then(article => {
    res.render('front/actualites', {
      article,
      current: 'actualites'
    });
  });
});

app.get('/top100/*', (req, res) => {
  res.render('front/top100', {
    current: 'categories'
  });
});

app.get('/admin/index', (req, res) => {
  db.Article.findAll().then(article => {
    res.render('admin/index', {
      article,
      href: '/admin/add',
      obj: 'article',
      edit: '/admin/edit/',
      delete: '/admin/delete/'
    });
  });
});

app.get('/admin/add', (req, res) => {
  sequelize.Project = sequelize.import('./models/partner');
  console.log(sequelize.Project);
  db.Article.findAll().then(element => {
    let valueNotSlice = Object.keys(element[0].dataValues);
    let value = valueNotSlice.slice(1, -2);
    if (!value) value = ['title', 'subtitle', 'image', 'text', 'signature'];
    console.log(value);
    res.render('admin/add', {
      value,
      href: '/admin/add'
    });
  });
});

// Route add admin -> POST
app.post('/admin/add', upload, (req, res) => {
  db.Article.create({
    title: req.body.title,
    subtitle: req.body.subtitle,
    image: req.file.filename,
    text: req.body.text,
    signature: req.body.signature
  })
    .then(task => {
      res.redirect('/admin/index');
    })
    .catch(err => {
      console.log(err);
    });
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
  }).then(article => {
    console.log(article.id);
    res.render('admin/edit', {
      tab: [
        article.title,
        article.subtitle,
        article.image,
        article.text,
        article.signature,
        article.id
      ],
      tabKey: ['title', 'subtitle', 'image', 'text', 'signature'],
      lenght: 6,
      update: '/admin/edit/',
      id: article.id
    });
  });
});

// Route update admin -> POST
app.post('/admin/edit/:id', upload, (req, res) => {
  db.Article.update(
    {
      title: req.body.title,
      subtitle: req.body.subtitle,
      //logo: req.file.fieldname,
      // image: req.file.filename,
      text: req.body.text,
      signature: req.body.signature
    },
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/index');
});

app.get('/admin/delete/:id', (req, res) => {
  res.render('admin/delete', {
    id: req.params.id,
    delete: '/admin/delete/'
  });
});

module.exports = app;
