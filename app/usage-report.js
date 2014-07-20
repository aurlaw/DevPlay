var program = require('commander'),
	logger = require('winston'),
	dateFormat = require('dateformat'),
	fs = require('fs')
	_ = require('lodash'),
	async = require('async'),
	pjson = require('./package.json');
	config = require('./config/usage.json'),
	nodemailer = require('nodemailer'),
	Connection = require('ssh2');


// set up logging
var logName = __filename.slice(0, -3).replace(__dirname, '');
logFile = 'logs/'+ logName +'_' + dateFormat(new Date(), "yyyy-mm-dd") + '.log';
logger.add(logger.transports.File, { filename: logFile });


function display() {
	logger.info('display');
	getUsage(function(err, data) {
		if (err) throw err;
		console.log(data);
	});
}

function email() {
	logger.info('email');
	var transporter = nodemailer.createTransport(config.email);
	var mailOptions = config.mailOptions;
	mailOptions.text = '';
	//mailOptions.html = '';
	getUsage(function(err, data) {
		if (err) throw err;

		var body = 'Usage Report\n';
		body += data.uptime + '\n\n';
		body += data.memory + '\n\n';
		body += data.disk;
		mailOptions.text = body;
		transporter.sendMail(mailOptions, function(error, info){
		    if(error) throw error;

		    logger.info(info.response);
		});
	});


}

function getUsage(cb) {
	logger.info('getUsage');
	var results = {
		error: null,
		data: {}
	};

	var connectionObj = {};
	if(config.ssh.uses_key) {
	  connectionObj = {
	  	host: config.ssh.host,
		port: config.ssh.port,
	  	username: config.ssh.username,
	  	privateKey: fs.readFileSync(config.ssh.private_key)}
	} else {
	  connectionObj = {
	  	host: config.ssh.host,
	  	port: config.ssh.port,
	  	username: config.ssh.username,
	  	password: config.ssh.password}
	}
	// connect to SSH
	var conn = new Connection();
	conn.on('ready', function() {
	  logger.info('Connection :: ready');
		async.series([
	        //Load uptime
	      function(callback) {
			  conn.exec('uptime', function(err, stream) {
			    if (err) results.error = err;
			    stream.on('exit', function(code, signal) {
			      logger.info('Stream :: exit :: code: ' + code + ', signal: ' + signal);
			    }).on('close', function() {
			      logger.info('Stream :: close');
			      callback();
			      //conn.end();
			    }).on('data', function(data) {
			      logger.info('STDOUT: ' + data);
			      results.data.uptime = 'System Uptime:\n ' + data;
			    }).stderr.on('data', function(data) {
			    	 results.error = new Error(data);
				     // logger.info('STDERR: ' + data);
			    });
			  });
	        },
	        //Load Memoery usage
	        function(callback) {
				conn.exec('free -m', function(err, stream) {
					if (err) results.error = err;
					stream.on('exit', function(code, signal) {
						logger.info('Stream :: exit :: code: ' + code + ', signal: ' + signal);
					}).on('close', function() {
						logger.info('Stream :: close');
					    callback();
						//conn.end();	
					}).on('data', function(data) {
						// logger.info('STDOUT: ' + data);
				      results.data.memory = 'Memory Usage:\n ' + data;
					}).stderr.on('data', function(data) {
				    	 results.error = new Error(data);
					     logger.info('STDERR: ' + data);
					});
				});
	        },
	        // load disk usage (df -h)
	        function(callback) {
				conn.exec('df -h', function(err, stream) {
					if (err) results.error = err;
					stream.on('exit', function(code, signal) {
						logger.info('Stream :: exit :: code: ' + code + ', signal: ' + signal);
					}).on('close', function() {
						logger.info('Stream :: close');
					    callback();
						//conn.end();	
					}).on('data', function(data) {
						// logger.info('STDOUT: ' + data);
				      results.data.disk = 'Disk Usage: \n' + data;
					}).stderr.on('data', function(data) {
				    	 results.error = new Error(data);
					     logger.info('STDERR: ' + data);
					});
				});
	        },	        
	    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
	        if (err) results.error = err; 
	        //Here locals will be populated with 'user' and 'posts'
	        cb(results.error, results.data);
	        logger.info('tasks completed');
	        conn.end();
	    });
	}).on('error', function(err) { 
		results.error = err;
		cb(results.error);
	}).connect(connectionObj);

}

/*
Application Main
*/
function find(val) {
  return val;
}

program
	.version(pjson.version)
	.option('-s, --show', 'Returns Usage: Uptime, Memory and Disk usage')
	.option('-e, --email', 'Email Usage')
  	.parse(process.argv);


//  .option('-i, --integer <n>', 'An integer argument', parseInt)
if(program.show) display();
else if (program.email) email();
else program.outputHelp();



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
