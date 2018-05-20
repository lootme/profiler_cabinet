// strict mode for all modules
require('use-strict');

// native modules
var http = require('http'),
	url = require('url'),
	querystring = require('querystring');

// other modules
var connect = require('connect'),
	compression = require('compression'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	connectSlashes = require("connect-slashes"),
	serveStatic = require('serve-static'),
	multiparty = require('multiparty');

// middleware plugins
var app = connect();
app.use(serveStatic(__dirname + '/'));
app.use(connectSlashes());
app.use(compression());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
	secret: 'secret'
}));

// adding passport middleware and auth module
global.auth = require('./core/auth.js')(app);

// jsx support
var jsx = require('node-jsx');
jsx.install();

// cms
var config = require('./config'),
	cmsModule = require('./core/cms'),
	helper = require('./core/helper');

// global modules for using in views
global.stubs = require('./stubs.js')();
	
// entry point
function run(pathname, request, response, next) {
	global.cms = cmsModule(config);
	var models = cms.getModels();
	models.sequelize.sync().then(function() {
		request.query = request.get;
		request.body = request.post;
		
		var requestResponseData = { pathname : pathname, request : request, response : response, next : next };
		auth.init(requestResponseData, config);
		cms.init(requestResponseData);
	});
}

console.log('Application start point reached.');

app.use(function onRequest(request, response, next) {
	
	var pathname = url.parse(request.url).pathname,
		urlParts = url.parse(request.url, true),
		contentType = request.headers['content-type'];
		
	console.log('Request for ' + pathname + ' received.');

	request.get = urlParts.query;
	console.log("AUTH1:", request.isAuthenticated(), request.user);
	if(contentType && contentType.indexOf('multipart/form-data') >= 0) {
		console.log('Request type is multipart/form-data');
		var form = new multiparty.Form();
		form.parse(request, function(err, postData, files) {
			if(!err) {
				for(var i in postData) {
					var current = postData[i];
					if(typeof(current) == 'object'
						&& helper.getLength(current) == 1) {
						postData[i] = current[0];
					}
				}
				request.post = postData;
			} else {
				console.log('server error: ' + err);
			}
				
			request.setEncoding('utf8');
			run(pathname, request, response, next);
		});
		return;
	}
	
	console.log("AUTH2:", request.isAuthenticated(), request.user);
	
	var postData = '';
	request.setEncoding('utf8');
    request.addListener('data', function(postDataChunk) {
		postData += postDataChunk;
    });
    request.addListener('end', function() {
		request.post = querystring.parse(postData);
		run(pathname, request, response, next);
	});
});
console.log('Application port number is 8888.');
http.createServer(app).listen(8888);