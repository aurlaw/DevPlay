'use strict';

var	config = require('config/config.json');
var passTemplate = require("passbook");


module.exports.generatePass = function(model) {
	//passbook
	// var template = createTemplate("generic", {
	//   passTypeIdentifier: "pass.com.example.passbook",
	//   teamIdentifier:     "MXL",
	//   backgroundColor:   "rgb(255,255,255)"
	// });
	console.log(model);
	console.log(config);
/*
{
	"passbook" : {
	  "secret":    "aurlaw",
	  "passID" :	"pass.com.aurlaw.passbookexpressdev",
	  "teamID":		"T54JASTD4Z"
	 },
	 "membership": {
	 	"organizationName" : "Aurlaw Solutions",
	 	"description" : "Membership card",
		"foregroundColor" : "rgb(255, 255, 255)",
		"backgroundColor" : "rgb(12, 76, 120)",
		"barcode" : {
			"format" : "PKBarcodeFormatPDF417",
			"messageEncoding" : "iso-8859-1"
		}		
	 }
}


template.keys("/etc/passbook/keys", "secret");
template.loadImagesFrom("images");

var pass = template.createPass({
  serialNumber:  "123456",
  description:   "20% off"
});

*/

	// var io = require('socket.io')(server);

	// io.on('connection', function (socket) {

	// 	var T = new Twit(config.twitter)
	// var stream = T.stream('statuses/filter', { track: ['mango', 'mongo', 'apple', 'nodejs', 'expressjs', 'angularjs'] , language: 'en' })

	// 	stream.on('tweet', function (tweet) {
	// 	  //console.log(tweet)
	// 	  socket.emit('tweet', tweet);
	// 	});

	// 	// socket.emit('news', { hello: 'world' });
	// 	// socket.on('my other event', function (data) {
	// 	// console.log(data);
	// 	// });
	// });

}