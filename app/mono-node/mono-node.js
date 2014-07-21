var program = require('commander'),
	logger = require('winston'),
	dateFormat = require('dateformat'),
	fs = require('fs')
	_ = require('lodash'),
	async = require('async'),
	pjson = require('./package.json');
	var edge = require('edge');


	// set up logging
var logName = __filename.slice(0, -3).replace(__dirname, '');
logFile = 'logs/'+ logName +'_' + dateFormat(new Date(), "yyyy-mm-dd") + '.log';
logger.add(logger.transports.File, { filename: logFile });


function callDotNet() {
	logger.info('callDotNet');

	var clrMethod = edge.func({
    assemblyFile: 'SampleNode.Data.dll',
    typeName: 'SampleNode.Data.Tester',
    methodName: 'Perform' // This must be Func<object,Task<object>>
	});

	    // Invoke the .NET function
    clrMethod(null, function (error, result) {
    	if(error) logger.error(error);
    	logger.info(result);
    	
    	logger.info('The answer is "' + result.Result.Answer + '"');
    });
}

function callInlineDotNet() {

	var getPerson = edge.func(function () {/*
	    using System.Threading.Tasks;

	    public class Person
	    {
	        public int anInteger = 1;
	        public double aNumber = 3.1415;
	        public string aString = "foo";
	        public bool aBoolean = true;
	        public byte[] aBuffer = new byte[10];
	        public object[] anArray = new object[] { 1, "foo" };
	        public object anObject = new { a = "foo", b = 12 };
	    }

	    public class Startup
	    {
	        public async Task<object> Invoke(dynamic input)
	        {
	            Person person = new Person();
	            return person;
	        }
	    }
	*/});

	getPerson(null, function (error, result) {
	    if (error) throw error;
	    logger.info(result);
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
	.option('-c, --call', 'Call .NET method')
	.option('-i, --inline', 'Call inline .NET method')
  	.parse(process.argv);


//  .option('-i, --integer <n>', 'An integer argument', parseInt)
if(program.call) callDotNet();
else if (program.inline) callInlineDotNet();
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