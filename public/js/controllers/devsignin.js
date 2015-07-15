angular.module('devSigninController', ['ui.bootstrap', 'devSigninConfig'])

	// inject the Entry service factory into our controller
	.controller('mainController', ['$scope','$http','Entries','$modal', 'DevCache', 'config',
	                               function($scope, $http, Entries, $modal, DevCache, config ) {
		$scope.loading = true;
		
		$scope.today = new Date();
		$scope.disclaimer = config.disclaimer;
		
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
            });
		
		DevCache.getPovs()
            .success(function(data) {
                $scope.povs = data.split(":");
                $scope.loading = false;
            });

		$scope.signin = function () {
		    var modalInstance = $modal.open({
		        animation: true,
		        templateUrl: '../../templates/signinPopupTemplate.html',
		        controller: 'signinCtrl',
		        scope: $scope
		    });
		    
		    modalInstance.result.then(function (data) {
		        $scope.entries = data;
		    }, function () {
		        console.log('Signin Modal dismissed at: ' + new Date());
		    });
		};
		
		$scope.showSignoutPopup = function(entry) {
		    var modalInstance = $modal.open({
		        animation: true,
		        templateUrl: '../../templates/signoutPopupTemplate.html',
		        controller: 'signoutCtrl',
		        resolve: {
		            signingoutUser: function () {
		              return entry;
		            }
		        }
	        });
	            
            modalInstance.result.then(function (data) {
                $scope.entries = data;
            }, function () {
                console.log('Signout Modal dismissed at: ' + new Date());
            });
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
		
	}]);