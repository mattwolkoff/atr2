
app.controller('MapCtrl', function MapCtrl($scope, $modal, sailsSocket, $log, filterFilter){
	$scope.markers = [];
	$scope.markers = mesoStation.markers;
	mesoStation.markers = $scope.markers;
	$scope.stations = mesoStation.stations;
	console.log('map ctrl',$scope.markers);
	$scope.$watch('markers',function(){
		console.log('change',$scope.markers);
	})
});