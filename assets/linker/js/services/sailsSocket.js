'use strict';

// See: angular-sails.io.js for sailsSocketFactory
app.factory('sailsSocket', function(sailsSocketFactory, $log) {

  var sailsSocket = sailsSocketFactory({port:'1340',reconnectionAttempts: 10 });



  //$log.debug('Connecting to Sails.js...');
  return sailsSocket.connect();
});