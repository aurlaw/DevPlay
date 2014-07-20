var program = require('commander'),
	logger = require('winston'),
	sanitize = require("sanitize-filename"),
	dateFormat = require('dateformat'),
	fs = require('fs')
	_ = require('lodash'),
	pjson = require('./package.json'),
	redis = require("redis");

// set up logging
var logName = __filename.slice(0, -3).replace(__dirname, '');
logFile = 'logs/'+ logName +'_' + dateFormat(new Date(), "yyyy-mm-dd") + '.log';
logger.add(logger.transports.File, { filename: logFile });



var maxVal = 1000000;
var csvFile = 'data/data.csv';
var client = null;

function createRedisClient() {
	if(!client) {
		client = redis.createClient();

		client.on('connect'     , log('connect'));
		client.on('ready'       , log('ready'));
		client.on('reconnecting', log('reconnecting'));
		client.on('error'       , log('error'));
		client.on('end'         , log('end'));
	}

}

function log(type) {
    return function() {
        logger.info(type, arguments);
    }
}

function createFile () {
	logger.info('createFile');

	var stream = fs.createWriteStream(csvFile, {flags: 'w'});

	var i = 0;
	writeFile = function () {
		while (i < maxVal) {
			var line = 'body-' + i + ', some-name' + i + '\n';
			i++;
			if(!stream.write(line)) {
		      // buffer is full, don't write any more until we're notified 
		      logger.info('draining file at ' + i);
		      stream.once('drain', writeFile);
		      return;
			}
		}
	stream.end();
	}
	writeFile();

	// for (var i = 0; i <= maxVal; i++) {
		
	// 	var line = 'body-' + i + ', some-name' + i + '\n';
	// }
	// stream.end();

}


function loadFile() {
	logger.info('loadFile into redis');
	createRedisClient();


	client.flushdb(function (err, succes) {
		if(succes) {

			logger.info('redis flushed');
			var csv = require("fast-csv");

			csv
			 .fromPath("data.csv")
			 .on("record", function(data){

			 	var key = data[0] ? data[0].trim() : null;
			 	var val = data[1] ? data[1].trim().replace(/(\r\n|\n|\r)/gm,"") : null;
			 	if(key && val)
				 	 client.set(key, val, redis.print);
			 })
			 .on("end", function(){
			     console.log("done");
			     client.end();
			 });

		}
		else
			logger.error(err);
	});
}

function testLookups(id) {
	logger.info('testLookups ' + id);
	createRedisClient();

	var key = 'body-' + id;
	client.get(key, function(err, reply) {
		if(err) logger.error(err);
		else {
	    	// reply is null when the key is missing
	    	if(reply)
		    	logger.info(reply);
		    else
		    	logger.info('not found');
		}
	    client.end();

	});

	//body-100000

}

/*
   client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.set("string key", "string val", redis.print);
    client.hset("hash key", "hashtest 1", "some value", redis.print);
    client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
    client.hkeys("hash key", function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });

*/


/*
Application Main
*/
program
	.version(pjson.version)
	.option('-c, --create', 'Create test cvs file with ' + maxVal + ' records')
	.option('-l, --load', 'Load test file into redis')
	.option('-t, --test <n>', 'Enter test value between 0 and  ' + maxVal, parseInt)
  	.parse(process.argv);


//  .option('-i, --integer <n>', 'An integer argument', parseInt)
if(program.create) createFile();
else if(program.load) loadFile();
else if (program.test) testLookups(program.test);
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
