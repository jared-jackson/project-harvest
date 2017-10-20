angular.module('ProjectHarvestApp')
    .controller('CynoCtrl', function ($scope, $rootScope, $http, $location, $window, $auth, Cyno) {
        $scope.battle_summary = false;
        $scope.messages = {};
        $scope.checkCynoPilot = function () {
            $scope.cyno_data = {};
            $scope.team_a = {};
            $scope.team_b = {};
            $scope.battle_summary = false;
            var character_name = {
                character_name: $scope.character.name
            };
            Cyno.checkCynoPilot(character_name)
                .then(function (response) {
                    $scope.cyno_data = response.data;
                    if ($scope.cyno_data.drop_region != "unknown") {
                        $scope.battle_summary = true;
                        var alliance_name = $scope.cyno_data.alliance_id;
                        var victim_alliance_name = $scope.cyno_data.victim_id;
                        $scope.hot_drop_corp = $scope.cyno_data.summary.teamB.entities[alliance_name];
                        $scope.victim_corp = $scope.cyno_data.summary.teamA.entities[victim_alliance_name];
                        $scope.team_a = $scope.cyno_data.summary.teamA;
                        $scope.team_b = $scope.cyno_data.summary.teamB;
                    } else {
                        $scope.battle_message = "No recent battle information";
                    }
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
    });

