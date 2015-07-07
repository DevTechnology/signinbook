angular.module('devSigninService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Entries', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/entries');
			},
			create : function(entry) {
				return $http.post('/api/entries', entry);
			},
			delete : function(id) {
				return $http.delete('/api/entries/' + id);
			}
		}
	}]);