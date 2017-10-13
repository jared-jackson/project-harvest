angular.module('ProjectHarvestApp')
    .controller('SystemCtrl', function ($scope, $rootScope, $http, $location, $window, $auth, Account, System) {
        $scope.newSystem = function () {
            var new_system = {
                system_name: $scope.system.name
            };
            System.newSystem(new_system)
                .then(function (response) {
                    $location.path('/');
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
    });

