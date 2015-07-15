angular.module('devSigninController')
    .controller('signoutCtrl', ['$scope','$http','Entries','$modalInstance', '$filter', 'signingoutUser', function($scope, $http, Entries, $modalInstance, $filter, signingoutUser) {
        
        $scope.signingoutUser = signingoutUser;
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
        
        // sign out =================================================================
        $scope.signout = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if (signingoutUser != undefined) {
                $scope.loading = true;
                signingoutUser.timeOut = new Date();
                
                Entries.update(signingoutUser)
                    .success(function (data) {
//                        $scope.entries = data;
                        $scope.loading = false;
                        $modalInstance.close(data);
                    });
            }
        };
        
    }]);