angular.module('ProjectHarvestApp')
    .controller('CynoCtrl', function ($scope, $rootScope, $http, $location, $window, $auth, Cyno) {
        $scope.checkCynoPilot = function () {
            var character_name = {
                character_name: $scope.character.name
            };
            Cyno.checkCynoPilot(character_name)
                .then(function (response) {
                    $scope.messages = {};
                    $scope.is_cyno = response.data;
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
    });

