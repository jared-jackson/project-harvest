angular.module('ProjectHarvestApp')
    .factory('System', function($http) {
        return {
            newSystem: function(data) {
                return $http.post('/newSystem', data);
            }
        };
    });