'use strict';


module.exports = function(router, server) {


    // Home route
    var index = require('../controllers/index');
    // index.createSocket(server);

    router.get('/', index.render);
    router.post('/generate', index.generate);

};