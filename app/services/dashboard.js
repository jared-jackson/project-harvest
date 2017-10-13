angular.module('ProjectHarvestApp')
    .factory('Dashboard', function($http) {
        return {
            getSystems: function(data) {
                return $http.get('/getSystems', data);
            }
        };
    });