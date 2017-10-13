angular.module('BlumeApp')
    .controller('GrowCtrl', function ($scope, $rootScope, $http, $location, $window, $auth, Account, GrowControls) {
        $scope.createGrow = function () {
            var new_grow = {
                grow_name: $scope.grow.name,
                environment: $scope.grow.environment,
                grow_items: ["White Widow", "Sour Diesel", "Blue Dream"]
            };
            GrowControls.createGrow(new_grow)
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

