'use strict';

app.controller('adminUserCtrl', function TodoCtrl($scope, $modal, sailsSocket, $log ) {
  $scope.users = [];
  $scope.newUser = { username: '',email:'', isComplete: false };
  
  //
  // Listen for Sails/Socket events
  //
  $scope.$on('sailsSocket:connect', function(ev, data) {
    // Get full collection of todos
    sailsSocket.get(
      '/admin/userList', {},
      function(response) {
        $scope.users = response;
        console.log($scope.users);
        $scope.users.forEach(function(user){
          if(!user.stations){
            user.stations = [];
          }
        })
        //$log.debug('sailsSocket::/userList', response);
    });
  });

  $scope.$on('sailsSocket:message', function(ev, data) {

    //$log.debug('New comet message received :: ', data);

  });

  $scope.logout = function () {
    sailsSocket.post('/logout', {},
      function(response) {
        window.location = '/';
      });
  };

  //
  // Edit / New Todo modal
  //
  //
  // Login modal
  //
  $scope.openModal = function (user) {
    var modalInstance = $modal.open({
      templateUrl: 'UserModalContent.html',
      controller: UserModalCtrl,
      resolve: {
        user: function () {
          return angular.copy(user);
        }
      }
    });
    
    modalInstance.result.then(function (result) {
      sailsSocket.get(
        '/admin/userList', {},
        function(response) {
          $scope.users = response;
          //$log.debug('sailsSocket::/userList', response);
      });
    });
  };
});

function UserModalCtrl($scope, $modalInstance,sailsSocket,user) {
  $scope.user = user;
  $scope.message='';
  

  $scope.ok = function (inaction) {
    if($scope.user.id){
      if(inaction == 'delete'){
        sailsSocket.delete('/user/'+$scope.user.id,
          function(response) {
            $scope.parseResponse(response,'delete');
        });
      }else{
        sailsSocket.put('/user/'+$scope.user.id, $scope.user,
          function(response) {
            $scope.parseResponse(response,'put');
        });
      }
    }else{
      sailsSocket.post('/user', $scope.user,
        function(response) {
         $scope.parseResponse(response,'post');
      });
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.parseResponse = function(response,type){
    //console.log(response,type);
    if(response.status == 500){
      var error = response.error;
      if(type == 'post'){
        error = response.errors[0];
      }
      //console.log(error);
      if(typeof error == 'string'){
        $scope.message = error;
      }
      else if(error.ValidationError){
        $scope.message = '';
        for(var key in error.ValidationError){
          $scope.message+=key;
          $scope.message+=' - '+error.ValidationError[key][0].message+'\n';
        }
      }else {
        $scope.message = "Unknown error - "+JSON.stringify(response);
      }
    }else{
      $modalInstance.close();
    }
  };
}