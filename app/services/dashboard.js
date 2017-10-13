angular.module('BlumeApp')
    .factory('Dashboard', function($http) {
        return {
            getGrows: function(data) {
                return $http.get('/getGrows', data);
            }
        };
    });