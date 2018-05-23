let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let multer = require('multer');

let port = process.env.PORT || 8000;

let index = require('./routes/index');
//let admin = require('./routes/admin');
const db = require(`${__dirname}/models/index.js`);

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
  express: app,
  autoescape: true
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
//app.use('/admin', admin);

app.get('/auth', (req,res) => {
  res.render('auth');
});



app.get('/admin/delete/:id', (req, res) => {
  res.render('admin/delete', {
    id: req.params.id
  })
});

// Functions

function findall(req, res ,name) {
  db.name.findAll().then(element => {
    res.render('admin/index', {
      element
    })
  })
}

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

app.get('/admin/imagesbox', (req,res) => {
  db.ImagesBox.findAll().then(article => {
    res.render('admin/index', {
      article,
      href:'/admin/add/imagesbox',
      obj: "image box",
      edit: "",
      delete: ""
    })
  })
})

app.get('/admin/airlinescompanies', (req,res) => {
  db.AirlineCompany.findAll().then(article => {
    res.render('admin/index', {
      article,
      href:'/admin/add/airlinescompanies',
      obj: "airline company",
      edit: "",
      delete: ""
    })
  })
})

app.get('/admin/partners', (req,res) => {
  db.Partner.findAll().then(article => {
    res.render('admin/index', {
      article,
      href:'/admin/add/partners',
      obj: "partner",
      edit: "/admin/edit/partners/",
      delete: "/admin/delete/partners/"
    })
  })
})

//////////////////////////////////////////////////////////////////

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

app.get('/admin/add/imagesbox', (req, res) => {
  db.ImagesBox.findAll().then(element => {
    let valueNotSlice = Object.keys(element[0].dataValues)
    let value = valueNotSlice.slice(1, -2);
    console.log(value)
    res.render('admin/add', {
      value,
      href: "/admin/add/imagesbox"
    })
  })
});

app.get('/admin/add/airlinescompanies', (req, res) => {
  console.log(db.AirlineCompany)
  db.AirlineCompany.findAll().then(element => {
    let valueNotSlice = Object.keys(element[0].dataValues)
    let value = valueNotSlice.slice(1, -2);
    
    console.log(value)
    res.render('admin/add', {
      value,
      href: "/admin/add/airlinescompanies"
    })
  })
});

app.get('/admin/add/partners', (req, res) => {
  db.Partner.findAll().then(element => {
    let valueNotSlice = Object.keys(element[0].dataValues)
    let value = valueNotSlice.slice(1, -2);
    console.log(value)
    res.render('admin/add', {
      value,
      href: "/admin/add/partners"
    })
  })
});

////////////////////////////////////////////////////////////////////

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


app.post('/admin/add/imagesbox', upload, (req, res) => {
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

app.post('/admin/add/airlinescompanies', upload, (req, res) => {
  db.AirlineCompany
    .create({
      name: req.body.name
    })
    .then(task => {
      res.redirect('/admin/airlinescompanies');
    })
    .catch(err => {
      console.log(err);
    })
});

app.post('/admin/add/partners', upload, (req, res) => {
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

////////////////////////////////////////////////////////////////////

// Route delete admin
app.post('/admin/delete/:id', (req, res) => {
  db.Article.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect('/admin/index');
});

app.post('/admin/delete/partners/:id', (req, res) => {
  db.Partner.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect('/admin/partners');
});

app.post('/admin/delete/airlinescompanies/:id', (req, res) => {
  db.Partner.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect('/admin/airlinescompanies');
});

app.post('/admin/delete/imagesbox/:id', (req, res) => {
  db.Partner.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect('/admin/imagesbox');
});

/////////////////////////////////////////////////////////////////////////////

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
      title: article.title,
      subtitle: article.subtitle,
      image: article.image,
      text: article.text,
      signature: article.signature,
      logo: article.logo,
      id: article.id
    });
  })
  
  });

// Route update admin -> POST
app.post('/admin/edit/:id', upload, (req, res) => {
 
  db.Article.update(
    { title: req.body.title,
      subtitle: req.body.subtitle,
      image: req.file.fieldname,
      text: req.body.text,
      signature: req.body.signature,
      logo: req.file.logo, },
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/index');
// }

});

app.get('/admin/edit/partners/:id', (req, res) => {

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
      update: "/admin/edit/partners/"
    });
  })
  });

// Route update admin -> POST
app.post('/admin/edit/partners/:id', upload, (req, res) => {
 
  db.Partner.update(
    { title: req.body.title,
      image: req.file.fieldname,
      signature: req.body.signature},
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/partners');
// }

});



//app.listen(port)

// console.log('Server listening on '+ port)

module.exports = app;
