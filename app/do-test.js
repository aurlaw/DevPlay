var program = require('commander'),
	logger = require('winston'),
	dateFormat = require('dateformat'),
	fs = require('fs')
	_ = require('lodash'),
	pjson = require('./package.json'),
	config = require('./config/digital_ocean.json'),
	DigitalOceanAPI = require('digitalocean-api');

// set up logging
var logName = __filename.slice(0, -3).replace(__dirname, '');
logFile = 'logs/'+ logName +'_' + dateFormat(new Date(), "yyyy-mm-dd") + '.log';
logger.add(logger.transports.File, { filename: logFile });



// Create an instance with your API credentials
var doApi = new DigitalOceanAPI(config.client_id, config.api_key);


function findAllDroplets() {
	logger.info('findAllDroplets');

	// Get things done
	doApi.dropletGetAll(function(error, droplets){
		if(error) logger.error(error);
	    logger.info(droplets);
	});	
}

function findDroplet(id) {
	logger.info('findDroplet for ' + id);

	//dropletGet(id, callback)
	doApi.dropletGet(id, function(error, droplets){
		if(error) logger.error(error);
	    logger.info(droplets);
	});	
}

function getSizes() {
	logger.info('getSizes');

	doApi.sizeGetAll( function(error, data){
		if(error) logger.error(error);
	    logger.info(data);
	});	

}

/*
Application Main
*/
function find(val) {
  return val;
}

program
	.version(pjson.version)
	.option('-a, --all', 'Find All Droplets')
	.option('-f, --find <n>', 'Find Droplet by id ', find)
	.option('-s, --size', 'Find All Sizes')
  	.parse(process.argv);


//  .option('-i, --integer <n>', 'An integer argument', parseInt)
if(program.find) findDroplet(program.find);
else if (program.all)findAllDroplets();
else if (program.size)getSizes();
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
