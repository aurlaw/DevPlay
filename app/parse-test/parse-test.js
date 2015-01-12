'use strict'
var program = require('commander'),
	logger = require('winston'),
	dateFormat = require('dateformat'),
	fs = require('fs'),
	_ = require('lodash'),
	async = require('async'),
	pjson = require('./package.json');

var Parse = require('node-parse-api').Parse;


	// set up logging
var logName = __filename.slice(0, -3).replace(__dirname, '');
var logFile = 'logs/'+ logName +'_' + dateFormat(new Date(), "yyyy-mm-dd") + '.log';
logger.add(logger.transports.File, { filename: logFile });




var APP_ID = 'CMMzhiAqivpzMgM5aF67KaiRkpZRdgzoeed4NeiD';
var MASTER_KEY = 'HzvLfqF0hQF4Fsm4FYtL7nh2ycmT2qAdgHCCtWyn';

var parseApi = new Parse(APP_ID, MASTER_KEY);

function createContact() {
	logger.info('createContact');

	var contact = {
		email: 'test@example.com',
		firstName: 'Test',
		lastName: 'User',
		subject: 'Test Message',
		message: 'Test data for parse.com',
		browser: 'Node.js cli',
		ipAddress: 'loopback'

	};

	parseApi.insert('Contact', contact, function (err, response) {
		if(err) throw err;
		logger.info(response);
	});
}

function getContact() {
	logger.info('getContact');

	parseApi.find('Contact', 'nWKuYGvplX', function (err, response) {
		if(err) throw err;
		logger.info(response);
	});	

}

function updateContact() {
	logger.info('updateUser');

	parseApi.find('Contact', 'nWKuYGvplX', function (err, response) {
		if(err) throw err;

		var contact = response;
		logger.info('found contact: ' + JSON.stringify(contact));
		contact.message = contact.message + ' updated(' + dateFormat(new Date(), "yyyy-mm-dd hh:MM") + ')';

		parseApi.update('Contact', 'nWKuYGvplX', contact, function (err, response) {
			if(err) throw err;
			logger.info(response);
		});

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
	.option('-c, --create', 'Create Parse Contact')
	.option('-g, --get', 'Get Parse Contact')
	.option('-u, --update', 'Update Parse Contact')
  	.parse(process.argv);


//  .option('-i, --integer <n>', 'An integer argument', parseInt)
if(program.create) createContact();
else if(program.get) getContact();
else if(program.update) updateContact();
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