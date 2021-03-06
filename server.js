const express = require('express');
const handlebars = require('express-handlebars');
const http_module = require('http');
const bodyParser = require('body-parser');
const compression = require('compression');
const expressValidator = require('express-validator');
const env = (process.env.NODE_ENV === 'development') ? 'development' : 'production';
const mcache = require('memory-cache');
const helmet = require('helmet')
let config;

// for all dates
process.env.TZ = 'America/New_York';

const app = express();
const is_dev = (env === 'development');
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
	type: ['json', 'application/csp-report']
}));
app.use(expressValidator());
app.use(express.static(__dirname + '/public'));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || 8080);
app.engine('.hbs', handlebars.create({
	layoutsDir: 'views/layouts',
	partialsDir: 'views/partials',
	defaultLayout: 'default',
	helpers: new require('./server/hbsHelpers')(),
	extname: '.hbs'
}).engine)

const cache = function cache(duration) {
	return function(req, res, next) {
		var key = '__rbi-cache-express__' + req.originalUrl || req.url;
		var cachedBody = mcache.get(key);
		if (cachedBody) {
			if (env === 'development') { console.log('HITTIN CACHE') }
			res.send(cachedBody);
			return;
		} else {
			if (env === 'development') { console.log('FRESH RESPONSE') }
			res.sendResponse = res.send;
			res.send = function(body) {
				mcache.put(key, body, duration * 1000);
				res.sendResponse(body);
			};
			next();
		}
	};
};

// Security Settings
app.use(helmet());
app.use(helmet.referrerPolicy())		// Sets "Referrer-Policy: no-referrer".

// Content Security Policy
//   http://content-security-policy.com/
//   http://www.html5rocks.com/en/tutorials/security/content-security-policy/
//   http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: [ "'self'" ],
		scriptSrc: [
			"'self'",
			"'unsafe-eval'",
			"'unsafe-inline'",
			'http://localhost:35729/livereload.js',
			'ajax.googleapis.com',
			'www.google-analytics.com',
			'cdnjs.cloudflare.com',
			'maps.googleapis.com',
			'https://*.healcode.com',
			'https://*.amplitude.com'
		],
		styleSrc: [
			"'self'",
			"'unsafe-inline'",
			'fonts.googleapis.com',
			'cdnjs.cloudflare.com',
			'https://*.healcode.com'
		],
		fontSrc: [
			"'self'",
			'fonts.googleapis.com',
			'fonts.gstatic.com',
			'cdnjs.cloudflare.com',
			'https://*.healcode.com'
		],
		imgSrc: [
			"'self'",
			'data:',
			'www.google-analytics.com',
			'twemoji.maxcdn.com',
			'scontent.cdninstagram.com',
			'i.imgur.com',
			'i.ytimg.com',
			'images.contentful.com',
			'images.ctfassets.net',
			'maps.googleapis.com',
			'maps.gstatic.com',
			'csi.gstatic.com',
			'https://*.healcode.com'
		],
		mediaSrc: [ "'self'" ],
		connectSrc: [ // limit the origins (via XHR, WebSockets, and EventSource)
			"'self'",
			//'ws://localhost:8000',
			'ws://localhost:* 127.0.0.1:*',
			'api.github.com',
			'https://*.healcode.com',
			'https://*.amplitude.com'
		],
		objectSrc: [ "'none'" ],// allows control over Flash and other plugins
		frameSrc: [ 'www.youtube.com', 'https://*.healcode.com', 'https://*.amplitude.com' ], // origins that can be embedded as frames
		sandbox: [ 'allow-same-origin', 'allow-forms', 'allow-scripts', 'allow-popups', 'allow-presentation'],
		reportUri: '/report-violation' // error reporting
	}
}))

app.post('/report-violation', function (req, res) {
	if (is_dev) {
		if (req.body) {
			const violation = eval(req.body);
			console.log('Violation:', violation['csp-report']['violated-directive'] + ' - ', violation['csp-report']['blocked-uri'])
		} else {
			console.log('CSP Violation: No data received!')
		}
	}
	res.status(204).end()
})

app.use(function(req, res, next) {

	config = require('./server/locals')(req.path);

	// Global hogan-express variables
	let namespace = (req.path === '/' || req.path === '/robots.txt') ? 'home' : req.path;
	namespace = namespace.replace('/', '');
	if (namespace.includes('event/')) {
		namespace = 'event';
	}
	app.locals.is_dev = is_dev;
	app.locals.namespace = namespace;
	app.locals.reqPath = req.path;
	app.locals.year = new Date().getFullYear();
	app.locals.navLinks = config.navLinks;

	app.locals.metaDesc = config.pageMeta.description;

	if (req.path === '/') {
		app.locals.metaTitle = 'RBI Tri-Cities - Premier Indoor Baseball & Softball Training Facility'
		app.locals.socialMetaTitle = 'RBI Tri-Cities'
		app.locals.socialMetaDesc = 'Premier Indoor Baseball & Softball Training Facility';
	} else {
		app.locals.metaTitle = config.pageMeta.title + ' | RBI Tri-Cities';
		app.locals.socialMetaTitle = config.pageMeta.title;
		app.locals.socialMetaDesc = 'RBI Tri-Cities - Premier Indoor Baseball & Softball Training Facility';
	}

	next();
});

// App Routes
require('./server/routes.js')(app, cache);

const http = http_module.Server(app)
http.listen(app.get('port'), function() {
	console.info('Server Running in ' + env + ' mode');
	console.info('Listening at http://localhost:%s', app.get('port'));
});
