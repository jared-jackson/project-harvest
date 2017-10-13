angular.module('BlumeApp')
    .factory('GrowControls', function($http) {
        return {
            createGrow: function(data) {
                return $http.post('/createGrow', data);
            }
        };
    });