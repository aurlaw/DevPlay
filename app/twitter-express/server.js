'use strict';


var 	logger = require('winston'),
	expressWinston = require('express-winston'),
	dateFormat = require('dateformat'),
	fs = require('fs')

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



// set up logging
var logName = __filename.slice(0, -3).replace(__dirname, '');
var logFile = 'logs/'+ logName +'_' + dateFormat(new Date(), "yyyy-mm-dd") + '.log';




var app     = express();
var port    = 	process.env.PORT || 3500;

var server = require('http').Server(app);



var swig = require('swig');
// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });


app.use(favicon());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


    // express-winston logger makes sense BEFORE the router.
    app.use(expressWinston.logger({
      transports: [
        new logger.transports.Console({
          json: true,
          colorize: true
        }),
		new logger.transports.File({ filename: logFile })
      ]
    }));



// Bootstrap routes
var router = express.Router();
var routes_path = __dirname + '/routes';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(router, server);
            }
        // We skip the app/routes/middlewares directory as it is meant to be
        // used and shared by routes as further middlewares and is not a 
        // route by itself
        } else if (stat.isDirectory() && file !== 'middlewares') {
            walk(newPath);
        }
    });
};
walk(routes_path);

//require('./routes/index')(router);
// use express router
app.use('/', router);



// Assume "not found" in the error msgs is a 404. this is somewhat
// silly, but valid, you can do whatever you like, set properties,
// use instanceof etc.
app.use(function(err, req, res, next) {
    // Treat as 404
    if (~err.message.indexOf('not found')) return next();

    // Log it
    console.error(err.stack);

    // Error page
    res.status(500).render('500', {
        error: err.stack
    });
});

// Assume 404 since no middleware responded
app.use(function(req, res) {
    res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
    });
});

 // express-winston errorLogger makes sense AFTER the router.
    app.use(expressWinston.errorLogger({
      transports: [
        new logger.transports.Console({
          json: true,
          colorize: true
        }),
        new logger.transports.File({ filename: logFile })
      ]
    }));
   // // Optionally you can include your custom error handler after the logging.
   //  app.use(express.errorLogger({
   //    dumpExceptions: true,
   //    showStack: true
   //  }));
// START THE SERVER
// ==============================================
server.listen(port);
logger.info('Magic happens on port ' + port);






function exitHandler(options, err) {
    if (options.cleanup) {
    	 console.log('clean'); 
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
