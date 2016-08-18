var path = require('path')
var express = require('express')
var session = require('express-session')
var nunjucks = require('nunjucks')
var routes = require('./app/routes.js')
var documentationRoutes = require(__dirname + '/docs/documentation_routes.js')
var favicon = require('serve-favicon')
var app = express()
var documentationApp = express()
var bodyParser = require('body-parser')
var browserSync = require('browser-sync')
var config = require('./app/config.js')
var utils = require('./lib/utils.js')
var packageJson = require('./package.json')

// Grab environment variables specified in Procfile or as Heroku config vars
var releaseVersion = packageJson.version
var username = process.env.USERNAME
var password = process.env.PASSWORD
var env = process.env.NODE_ENV || 'development'
var useAuth = process.env.USE_AUTH || config.useAuth
var useHttps = process.env.USE_HTTPS || config.useHttps

env = env.toLowerCase()
useAuth = useAuth.toLowerCase()
useHttps = useHttps.toLowerCase()

// Authenticate against the environment-provided credentials, if running
// the app in production (Heroku, effectively)
if (env === 'production' && useAuth === 'true') {
  app.use(utils.basicAuth(username, password))
}

// Set up App
var appViews = [__dirname + '/app/views/', __dirname + '/lib/']

var nunjucksAppEnv = nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
})

// Nunjucks filters
utils.addNunjucksFilters(nunjucksAppEnv)

// Set views engine
app.set('view engine', 'html')

// Set up documentation app
var documentationViews = [__dirname + '/docs/views/', __dirname + '/lib/']

var nunjucksDocumentationEnv = nunjucks.configure(documentationViews, {
  autoescape: true,
  express: documentationApp,
  noCache: true,
  watch: true
})
// Nunjucks filters
utils.addNunjucksFilters(nunjucksDocumentationEnv)

// Set views engine
documentationApp.set('view engine', 'html')

// Middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/public', express.static(path.join(__dirname, '/govuk_modules/govuk_template/assets')))
app.use('/public', express.static(path.join(__dirname, '/govuk_modules/govuk_frontend_toolkit')))
app.use('/public/images/icons', express.static(path.join(__dirname, '/govuk_modules/govuk_frontend_toolkit/images')))

// TODO: is this the right way to serve these assets?
documentationApp.use('/assets/images', express.static(__dirname + '/docs/assets/images'))

// Elements refers to icon folder instead of images folder
app.use(favicon(path.join(__dirname, 'govuk_modules', 'govuk_template', 'assets', 'images', 'favicon.ico')))

// Support for parsing data in POSTs
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Support session data
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: Math.round(Math.random() * 100000).toString()
}))

// send assetPath to all views
app.use(function (req, res, next) {
  res.locals.asset_path = '/public/'
  next()
})

// Add variables that are available in all views
app.use(function (req, res, next) {
  res.locals.serviceName = config.serviceName
  res.locals.cookieText = config.cookieText
  res.locals.releaseVersion = 'v' + releaseVersion
  next()
})

// Force HTTPs on production connections
if (env === 'production' && useHttps === 'true') {
  app.use(utils.forceHttps)
}

// Disallow search index idexing
app.use(function (req, res, next) {
  // Setting headers stops pages being indexed even if indexed pages link to them.
  res.setHeader('X-Robots-Tag', 'noindex')
  next()
})

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})

// routes (found in app/routes.js)
if (typeof (routes) !== 'function') {
  console.log(routes.bind)
  console.log('Warning: the use of bind in routes is deprecated - please check the prototype kit documentation for writing routes.')
  routes.bind(app)
} else {
  app.all('/', routes)
}

// Create separate router for docs
app.use('/docs', documentationApp)

// Docs under the /docs namespace
documentationApp.all('/', documentationRoutes)

// Strip .html and .htm if provided
app.get(/\.html?$/i, function (req, res) {
  var path = req.path
  var parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

// Auto render any view that exists

// App folder routes get priority
app.get(/^\/([^.]+)$/, function (req, res) {
  utils.matchRoutes(req, res)
})

// Documentation  routes
documentationApp.get(/^\/([^.]+)$/, function (req, res) {
  utils.matchRoutes(req, res)
})

console.log('\nGOV.UK Prototype kit v' + releaseVersion)
// Display warning not to use kit for production services.
console.log('\nNOTICE: the kit is for building prototypes, do not use it for production services.')

// start the app
utils.findAvailablePort(app, function (port) {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
  if (env === 'production') {
    app.listen(port)
  } else {
    app.listen(port - 50, function () {
      browserSync({
        proxy: 'localhost:' + (port - 50),
        port: port,
        ui: false,
        files: ['public/**/*.*', 'app/views/**/*.*'],
        ghostmode: false,
        open: false,
        notify: false,
        logLevel: 'error'
      })
    })
  }
})
