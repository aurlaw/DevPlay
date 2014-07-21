'use strict';

var Twit = require('twit'),
	config = require('../config/config.json');

module.exports.createSocket = function(server) {

	var io = require('socket.io')(server);

	io.on('connection', function (socket) {

		var T = new Twit(config.twitter)
	var stream = T.stream('statuses/filter', { track: ['mango', 'mongo', 'apple', 'nodejs', 'expressjs', 'angularjs'] , language: 'en' })

		stream.on('tweet', function (tweet) {
		  //console.log(tweet)
		  socket.emit('tweet', tweet);
		});

		// socket.emit('news', { hello: 'world' });
		// socket.on('my other event', function (data) {
		// console.log(data);
		// });
	});

}
module.exports.render = function(req, res) {
	  res.render('index', { title: 'Express 4'});

};

