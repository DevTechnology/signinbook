angular.module('devSigninController', ['ui.bootstrap'])

	// inject the Entry service factory into our controller
	.controller('mainController', ['$scope','$http','Entries','$modal', 'DevCache',
	                               function($scope, $http, Entries, $modal, DevCache ) {
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
		
		DevCache.getDevTechies()
    		.success(function(data) {
                $scope.devTechies = data.split(":");
                $scope.loading = false;
                console.log($scope.devTechies);
            });

		$scope.signin = function () {
		    var modalInstance = $modal.open({
		      animation: true,
		      templateUrl: 'myModalContent.html',
		      controller: 'ModalInstanceCtrl',
		      scope: $scope
		    });
		    
		    modalInstance.result.then(function (data) {
		        $scope.entries = data;
		      }, function () {
		          console.log('Modal dismissed at: ' + new Date());
		      });
		};
		    
		 // sign out =================================================================
        $scope.signout = function(entry) {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if (entry != undefined) {
                $scope.loading = true;
                entry.timeOut = new Date();
                
                Entries.update(entry)
                    .success(function (data) {
                        $scope.entries = data;
                        $scope.loading = false;
                    });
            }
        };
		    
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
	.controller('ModalInstanceCtrl', ['$scope','$http','Entries','$modalInstance', '$filter', function($scope, $http, Entries, $modalInstance, $filter) {
	    $scope.user = {};
	    // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createEntry = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.user != undefined) {
                $scope.loading = true;
                
                var userToUpdate = $scope.user;
                var now = new Date();
                userToUpdate.date = now;
                userToUpdate.timeIn = now;
                userToUpdate.timeOut = undefined;

                // call the create function from our service (returns a promise object)
                Entries.create(userToUpdate)

                    // if successful creation, call our get function to get all the new entries
                    .success(function(data) {
                        $scope.loading = false;
                        $modalInstance.close(data);
                    });
            }
        };
        
        $scope.dropdown = {
            isopen: false
        };

        $scope.toggled = function(open) {
            $log.log('Dropdown is now: ', open);
        };

        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dropdown.isopen = !$scope.dropdown.isopen;
        };

	    $scope.cancel = function () {
	      $modalInstance.dismiss('cancel');
	    };
	    
	    $scope.setCurrentPoc = function(techy) {
            $scope.user.poc = techy;
        };
        
        $scope.setCurrentName = function(name) {
            $scope.user.name = name;
        };
        
	}]);