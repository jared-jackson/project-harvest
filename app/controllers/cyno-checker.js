angular.module('ProjectHarvestApp')
    .controller('CynoCtrl', function ($scope, $rootScope, $http, $location, $window, $auth, Cyno) {
        $scope.checkCynoPilot = function () {
            var character_name = {
                character_name: $scope.character.name
            };
            Cyno.checkCynoPilot(character_name)
                .then(function (response) {
                    $scope.messages = {};
                    $scope.cyno_data = response.data;
                    var alliance_name = $scope.cyno_data.alliance_id.toString();
                    var victim_alliance_name = $scope.cyno_data.victim_id.toString();
                    $scope.hot_drop_corp = $scope.cyno_data.summary.teamB.entities[alliance_name];
                    $scope.victim_corp = $scope.cyno_data.summary.teamA.entities[victim_alliance_name];
                    $scope.team_a = $scope.cyno_data.summary.teamA;
                    $scope.team_b = $scope.cyno_data.summary.teamB;
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
    });

