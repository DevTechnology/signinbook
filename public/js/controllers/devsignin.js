angular.module('devSigninController', ['ui.bootstrap'])

	// inject the Entry service factory into our controller
	.controller('mainController', ['$scope','$http','Entries','$modal', function($scope, $http, Entries, $modal) {
		$scope.loading = true;
		
		$scope.today = new Date();

		// GET =====================================================================
		// when landing on the page, get all entries and show them
		// use the service to get all the entries
		Entries.get()
			.success(function(data) {
				$scope.entries = data;
				$scope.loading = false;
				console.log($scope.entries);
			});

		$scope.signup = function (size) {
		    var modalInstance = $modal.open({
		      animation: true,
		      templateUrl: 'myModalContent.html',
		      controller: 'ModalInstanceCtrl',
		      size: size
		    })};

		// DELETE ==================================================================
		// delete an entry after checking it
		$scope.deleteEntry = function(id) {
			$scope.loading = true;

			Entries.delete(id)
				// if successful creation, call our get function to get all the new entries
				.success(function(data) {
					$scope.loading = false;
					$scope.entries = data; // assign our new list of entries
				});
		};
	}])
	.controller('ModalInstanceCtrl', ['$scope','$http','Entries','$modalInstance', function($scope, $http, Entries, $modalInstance) {
	    
	    // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createEntry = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.user != undefined) {
                $scope.loading = true;

                // call the create function from our service (returns a promise object)
                Entries.create($scope.user)

                    // if successful creation, call our get function to get all the new entries
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.form.formData = {}; // clear the form so our user is ready to enter another
//                        $scope.entries = data; // assign our new list of entries
                    });
            }
        };
	    
	    $scope.ok = function () {
	      $modalInstance.close();
	    };

	    $scope.cancel = function () {
	      $modalInstance.dismiss('cancel');
	    };
	}]);