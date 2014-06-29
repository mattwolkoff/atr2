/*jslint node: true */
app.controller('MesonetCtrl', function MesonetCtrl($scope, $modal, sailsSocket, $log, $compile, $timeout, $http){
	mesonet.init();
	$('#main-nav').css('display','block');
	$scope.loggedIn = false;
	$scope.stations = [];
	$scope.mesoMap = {};
	

	
	$scope.$on('sailsSocket:message', function(ev, data) {

    $log.debug('New comet message received :: ', data);
  
  });
      



  
 
 
})