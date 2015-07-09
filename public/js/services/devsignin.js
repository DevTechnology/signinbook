angular.module('devSigninService', ['angular-cache'])
//    .config(function (CacheFactoryProvider) {
//        angular.extend(CacheFactoryProvider.defaults, {
//            maxAge: 60 * 60 * 1000 * 24,    // 24 hours
//            deleteOnExpire: 'aggressive',
//            onExpire: function (key, value) {
//                var _this = this; // "this" is the cache in which the item expired
//                $http.get('/api/devTechies').success(function (data) {
//                    _this.put(key, data);
//                });
//            }
//        });
//    })
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
			update : function(entry) {
                return $http.put('/api/entries', entry);
            },
			delete : function(id) {
				return $http.delete('/api/entries/' + id);
			}
		}
	}])
	.service('DevCache', ['$http','CacheFactory',function ($http, CacheFactory) {
	    if (!CacheFactory.get('devCache')) {
	        // or CacheFactory('bookCache', { ... });
	        CacheFactory.createCache('devCache', {
	            deleteOnExpire: 'aggressive',
	            recycleFreq:  60 * 60 * 1000 * 24, // 24 hours
	            onExpire: function (key, value) {
	                var _this = this; // "this" is the cache in which the item expired
	                $http.get(key).success(function (data) {
	                    _this.put(key, data);
	                });
	            }
	        });
	    }

	    var techiesCache = CacheFactory.get('techiesCache');

	    return {
	        getDevTechies: function () {
	            return $http.get('/api/devTechies', { cache: techiesCache });
	        }
	    };
	}]);
//	.factory('Techies', ['$http',function($http) {
//        return {
//            get : function() {
//                return $http.get('/api/devTechies');
//            }
//        }
//    }]);