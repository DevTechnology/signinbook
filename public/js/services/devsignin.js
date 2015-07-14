angular.module('devSigninService', ['angular-cache','devSigninConfig'])
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
	.factory('Entries', ['$http','config',function($http, config) {
		return {
			get : function() {
				return $http.get(config.backend + '/api/entries');
			},
			create : function(entry) {
				return $http.post(config.backend + '/api/entries', entry);
			},
			update : function(entry) {
                return $http.put(config.backend + '/api/entries', entry);
            },
			delete : function(id) {
				return $http.delete(config.backend + '/api/entries/' + id);
			}
		}
	}])
	.service('DevCache', ['$http','CacheFactory','config',function ($http, CacheFactory, config) {
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
	            return $http.get(config.backend + '/api/devTechies', { cache: techiesCache });
	        }
	    };
	}]);