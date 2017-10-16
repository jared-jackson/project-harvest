angular.module('ProjectHarvestApp')
    .factory('Cyno', function($http) {
        return {
            checkCynoPilot: function(data) {
                return $http.post('/checkCynoPilot', data);
            }
        };
    });